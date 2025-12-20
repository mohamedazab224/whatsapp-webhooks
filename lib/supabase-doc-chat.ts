// lib/supabase-doc-chat.ts - النسخة المعدلة
import { createClient } from '@supabase/supabase-js';
import { DeepSeekAgent } from './deepseek-agent';

export class SupabaseDocChat {
  private supabase;
  private deepSeek;
  private storageBaseUrl = 'https://zrrffsjbfkphridqyais.storage.supabase.co/storage/v1/s3';
  private publicStorageUrl = 'https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public';

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.deepSeek = new DeepSeekAgent();
  }

  /**
   * استيراد المجلدات الحالية كمشاريع
   */
  async importExistingFolders(userId: string): Promise<any[]> {
    const folders = ['cvs', 'cad', 'img', 'pdf', 'video', 'xlsx'];
    const projects = [];

    for (const folder of folders) {
      try {
        // التحقق إذا كان المشروع موجود بالفعل
        const { data: existingProject } = await this.supabase
          .from('ai_projects')
          .select('id')
          .eq('project_name', folder)
          .eq('user_id', userId)
          .single();

        if (!existingProject) {
          // إنشاء مشروع جديد
          const { data: project } = await this.supabase
            .from('ai_projects')
            .insert({
              user_id: userId,
              project_name: folder,
              project_description: `مجلد ${folder} من التخزين الحالي`,
              bucket_path: `whatsapp-media/${folder}`
            })
            .select()
            .single();

          if (project) {
            // استيراد الملفات من المجلد
            await this.importFilesFromFolder(project.id, folder);
            projects.push(project);
          }
        }
      } catch (error) {
        console.error(`[Import] Failed to import folder ${folder}:`, error);
      }
    }

    return projects;
  }

  /**
   * استيراد الملفات من مجلد معين
   */
  async importFilesFromFolder(projectId: string, folderName: string): Promise<number> {
    try {
      // جلب قائمة الملفات من storage
      const { data: files, error } = await this.supabase.storage
        .from('whatsapp-media')
        .list(folderName);

      if (error) throw error;

      let importedCount = 0;

      for (const file of files || []) {
        // تجاوز المجلدات الفرعية
        if (!file.name) continue;

        const fileUrl = `${this.publicStorageUrl}/whatsapp-media/${folderName}/${file.name}`;
        
        // التحقق إذا كان الملف مسجل بالفعل
        const { data: existingFile } = await this.supabase
          .from('ai_project_files')
          .select('id')
          .eq('storage_url', fileUrl)
          .single();

        if (!existingFile) {
          // تحديد نوع الملف من الامتداد
          const fileType = this.getFileType(file.name, folderName);
          
          // إدراج الملف في قاعدة البيانات
          const { error: insertError } = await this.supabase
            .from('ai_project_files')
            .insert({
              project_id: projectId,
              original_filename: file.name,
              file_type: fileType,
              file_size: file.metadata?.size || 0,
              storage_url: fileUrl,
              bucket_name: 'whatsapp-media',
              folder_path: folderName,
              processing_status: 'pending'
            });

          if (!insertError) {
            importedCount++;
            
            // معالجة الملف لاستخراج النص (خلفية)
            this.processFileForTextExtraction(projectId, file.name, folderName);
          }
        }
      }

      console.log(`[Import] Imported ${importedCount} files from folder ${folderName}`);
      return importedCount;

    } catch (error) {
      console.error(`[Import] Error importing files from ${folderName}:`, error);
      return 0;
    }
  }

  /**
   * تحديد نوع الملف
   */
  private getFileType(filename: string, folderName: string): string {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    // تحديد النوع بناءً على الامتداد أو اسم المجلد
    const typeMap: Record<string, string> = {
      // PDF
      'pdf': 'pdf',
      
      // صور
      'jpg': 'image', 'jpeg': 'image', 'png': 'image', 
      'gif': 'image', 'bmp': 'image', 'svg': 'image',
      
      // فيديو
      'mp4': 'video', 'avi': 'video', 'mov': 'video', 
      'wmv': 'video', 'flv': 'video',
      
      // Excel
      'xlsx': 'excel', 'xls': 'excel', 'csv': 'excel',
      
      // CAD
      'dwg': 'cad', 'dxf': 'cad',
      
      // CVs (سير ذاتية)
      'doc': 'document', 'docx': 'document', 'txt': 'document'
    };

    return typeMap[extension] || folderName || 'unknown';
  }

  /**
   * معالجة الملف لاستخراج النص
   */
  private async processFileForTextExtraction(projectId: string, filename: string, folderName: string) {
    try {
      const fileUrl = `${this.publicStorageUrl}/whatsapp-media/${folderName}/${filename}`;
      
      // تحديث حالة الملف إلى processing
      await this.supabase
        .from('ai_project_files')
        .update({ processing_status: 'processing' })
        .eq('storage_url', fileUrl);

      let extractedText = '';
      
      // استخراج النص بناءً على نوع الملف
      switch (this.getFileType(filename, folderName)) {
        case 'pdf':
          extractedText = await this.extractTextFromPDF(fileUrl);
          break;
        case 'document':
        case 'excel':
          extractedText = await this.extractTextFromDocument(fileUrl);
          break;
        case 'image':
          extractedText = await this.extractTextFromImage(fileUrl);
          break;
        default:
          extractedText = `[${filename}] - ملف ${folderName}`;
      }

      // تحديث قاعدة البيانات بالنص المستخرج
      await this.supabase
        .from('ai_project_files')
        .update({
          text_content: extractedText,
          processing_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('storage_url', fileUrl);

      console.log(`[Processing] Extracted text from ${filename}: ${extractedText.length} chars`);

    } catch (error) {
      console.error(`[Processing] Failed to process ${filename}:`, error);
      
      // تحديث حالة الملف إلى failed
      await this.supabase
        .from('ai_project_files')
        .update({ processing_status: 'failed' })
        .eq('storage_url', `${this.publicStorageUrl}/whatsapp-media/${folderName}/${filename}`);
    }
  }

  /**
   * استخراج النص من PDF
   */
  private async extractTextFromPDF(pdfUrl: string): Promise<string> {
    try {
      // هنا يمكنك استخدام مكتبة مثل pdf-parse أو خدمة خارجية
      // حالياً نستخدم تنزيل الملف وتحليله
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        return `PDF ملف: ${pdfUrl}`;
      }
      
      // ملاحظة: لتحليل PDF فعلياً، ستحتاج إلى مكتبة متخصصة
      return `PDF ملف يحتوي على صفحات متعددة. للتحليل الدقيق، يرجى استخدام مكتبة PDF parser.`;
      
    } catch (error) {
      return `خطأ في قراءة PDF: ${error.message}`;
    }
  }

  /**
   * استخراج النص من مستند
   */
  private async extractTextFromDocument(docUrl: string): Promise<string> {
    try {
      const response = await fetch(docUrl);
      const content = await response.text();
      
      // إذا كان الملف صغيراً، نعيد محتواه
      if (content.length < 10000) {
        return content;
      }
      
      return `مستند نصي بحجم ${content.length} حرف`;
      
    } catch (error) {
      return `مستند: ${docUrl}`;
    }
  }

  /**
   * استخراج النص من صورة (OCR افتراضي)
   */
  private async extractTextFromImage(imageUrl: string): Promise<string> {
    return `صورة: ${imageUrl}\n(يتطلب OCR لاستخراج النص)`;
  }

  /**
   * الدردشة مع ملفات مشروع معين
   */
  async chatWithProjectFiles(
    projectId: string,
    question: string,
    conversationHistory: Array<{role: string, content: string}> = []
  ): Promise<{ answer: string; sources: any[]; files: any[] }> {
    try {
      // جلب معلومات المشروع
      const { data: project, error: projectError } = await this.supabase
        .from('ai_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError || !project) {
        throw new Error('المشروع غير موجود');
      }

      // جلب ملفات المشروع
      const { data: files, error: filesError } = await this.supabase
        .from('ai_project_files')
        .select('*')
        .eq('project_id', projectId)
        .eq('processing_status', 'completed')
        .order('created_at', { ascending: false });

      if (filesError) throw filesError;

      if (!files || files.length === 0) {
        return {
          answer: `❌ لم أجد أي ملفات في مشروع "${project.project_name}". 
          
يمكنك:
1. استيراد الملفات من التخزين الحالي
2. رفع ملفات جديدة
3. اختيار مشروع آخر`,
          sources: [],
          files: []
        };
      }

      // استخراج النص من الملفات ذات الصلة
      const relevantContent = await this.extractRelevantContent(files, question);
      
      // إنشاء سياق المحادثة
      const contextPrompt = this.createContextPrompt(project, relevantContent, question);
      
      // إرسال إلى DeepSeek
      const messages = [
        {
          role: 'system',
          content: `أنت مساعد ذكي متخصص في تحليل ملفات المشاريع.
المشروع الحالي: ${project.project_name} - ${project.project_description}

مهمتك:
1. فهم السؤال بناءً على محتوى الملفات
2. الرد بدقة مع الإشارة إلى الملفات المصدر
3. إذا لم تجد الإجابة في الملفات، قل ذلك بوضوح
4. قدم اقتراحات لتحليل أكثر عمقاً

ملاحظة: الملفات من المجلد "${project.bucket_path}"`
        },
        {
          role: 'user',
          content: contextPrompt
        },
        ...conversationHistory
      ];

      const answer = await this.deepSeek.chatCompletion(messages, {
        max_tokens: 4000,
        temperature: 0.3
      });

      return {
        answer,
        sources: relevantContent.map(item => ({
          file_name: item.fileName,
          file_type: item.fileType,
          file_url: item.fileUrl,
          relevant_sections: item.sections.length
        })),
        files: files.map(file => ({
          id: file.id,
          name: file.original_filename,
          type: file.file_type,
          size: file.file_size,
          url: file.storage_url,
          status: file.processing_status
        }))
      };

    } catch (error) {
      console.error('[DocChat] Error:', error);
      throw new Error(`فشل في تحليل الملفات: ${error.message}`);
    }
  }

  /**
   * استخراج المحتوى ذو الصلة
   */
  private async extractRelevantContent(files: any[], question: string): Promise<any[]> {
    const relevantFiles = [];
    const questionLower = question.toLowerCase();
    
    for (const file of files) {
      if (file.text_content && file.text_content.length > 10) {
        const relevantSections = this.findRelevantSections(file.text_content, questionLower);
        
        if (relevantSections.length > 0) {
          relevantFiles.push({
            fileName: file.original_filename,
            fileType: file.file_type,
            fileUrl: file.storage_url,
            content: file.text_content.substring(0, 3000),
            sections: relevantSections
          });
        }
      }
    }

    return relevantFiles;
  }

  /**
   * البحث عن أقسام ذات صلة
   */
  private findRelevantSections(content: string, keywords: string): string[] {
    const sentences = content.split(/[.!?。！؟]+/);
    const relevant = [];
    
    for (const sentence of sentences) {
      if (sentence.trim().length > 20) {
        const sentenceLower = sentence.toLowerCase();
        const keywordsList = keywords.split(' ').filter(k => k.length > 3);
        
        if (keywordsList.some(keyword => sentenceLower.includes(keyword))) {
          relevant.push(sentence.trim().substring(0, 200));
        }
      }
    }
    
    return relevant.slice(0, 5); // أول 5 جمل ذات صلة
  }

  /**
   * إنشاء prompt السياق
   */
  private async createContextPrompt(project: any, relevantContent: any[], question: string): Promise<string> {
    let prompt = `المشروع: ${project.project_name}\n`;
    prompt += `الوصف: ${project.project_description || 'لا يوجد وصف'}\n`;
    prompt += `المسار: ${project.bucket_path}\n\n`;
    
    prompt += `سؤال المستخدم: "${question}"\n\n`;
    
    if (relevantContent.length === 0) {
      prompt += "⚠️ لم يتم العثور على محتوى ذي صلة مباشرة في الملفات.\n";
      prompt += "الملفات المتاحة للبحث:\n";
      
      const { data: allFiles } = await this.supabase
        .from('ai_project_files')
        .select('original_filename, file_type, processing_status')
        .eq('project_id', project.id)
        .limit(10);
      
      allFiles?.forEach((file, index) => {
        prompt += `${index + 1}. ${file.original_filename} (${file.file_type}) - ${file.processing_status}\n`;
      });
    } else {
      prompt += "📁 الملفات والمحتوى ذو الصلة:\n";
      
      relevantContent.forEach((item, index) => {
        prompt += `\n📄 الملف ${index + 1}: ${item.fileName} (${item.fileType})\n`;
        prompt += `🔗 الرابط: ${item.fileUrl}\n`;
        
        if (item.sections.length > 0) {
          prompt += "المحتوى ذو الصلة:\n";
          item.sections.forEach((section: string, secIndex: number) => {
            prompt += `  • ${section}\n`;
          });
        }
        
        prompt += "─".repeat(50) + "\n";
      });
    }
    
    prompt += `\nبناءً على المعلومات أعلاه، أجب على سؤال المستخدم.
إذا كانت المعلومات غير كافية، اقترح تحليل ملفات محددة.`;
    
    return prompt;
  }

  /**
   * الحصول على مشاريع المستخدم مع تعداد الملفات
   */
  async getUserProjects(userId: string): Promise<any[]> {
    const { data: projects, error } = await this.supabase
      .from('ai_projects')
      .select(`
        id,
        project_name,
        project_description,
        bucket_path,
        created_at,
        ai_project_files(count)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[DocChat] Error fetching projects:', error);
      return [];
    }

    return projects || [];
  }

  /**
   * البحث في جميع مشاريع المستخدم
   */
  async searchAcrossProjects(userId: string, query: string): Promise<any[]> {
    const { data: files, error } = await this.supabase
      .from('ai_project_files')
      .select(`
        *,
        ai_projects!inner(project_name, user_id)
      `)
      .eq('ai_projects.user_id', userId)
      .eq('processing_status', 'completed')
      .textSearch('text_content', query, {
        type: 'websearch',
        config: 'arabic'
      })
      .limit(20);

    if (error) {
      console.error('[Search] Error:', error);
      return [];
    }

    return files || [];
  }
}

// تصدير النسخة المعدلة
export const supabaseDocChat = new SupabaseDocChat();
