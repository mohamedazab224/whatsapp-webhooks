// app/api/projects/route.ts - ملف جديد
import { NextRequest, NextResponse } from 'next/server';
import { supabaseDocChat } from '@/lib/supabase-doc-chat';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const action = searchParams.get('action');

  if (!userId) {
    return NextResponse.json(
      { error: 'معرف المستخدم مطلوب' },
      { status: 400 }
    );
  }

  try {
    switch (action) {
      case 'import':
        // استيراد المجلدات الحالية
        const importedProjects = await supabaseDocChat.importExistingFolders(userId);
        return NextResponse.json({
          success: true,
          message: `تم استيراد ${importedProjects.length} مشروع`,
          projects: importedProjects
        });

      case 'list':
        // قائمة المشاريع
        const projects = await supabaseDocChat.getUserProjects(userId);
        return NextResponse.json({
          success: true,
          projects,
          count: projects.length
        });

      case 'search':
        // بحث عبر المشاريع
        const query = searchParams.get('query');
        if (!query) {
          return NextResponse.json(
            { error: 'كلمة البحث مطلوبة' },
            { status: 400 }
          );
        }
        
        const results = await supabaseDocChat.searchAcrossProjects(userId, query);
        return NextResponse.json({
          success: true,
          query,
          results,
          count: results.length
        });

      default:
        return NextResponse.json({
          endpoints: {
            'GET /api/projects?userId=X&action=list': 'قائمة المشاريع',
            'GET /api/projects?userId=X&action=import': 'استيراد المجلدات الحالية',
            'GET /api/projects?userId=X&action=search&query=Y': 'بحث عبر المشاريع'
          }
        });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, projectName, description } = body;

    if (!userId || !projectName) {
      return NextResponse.json(
        { error: 'المستخدم واسم المشروع مطلوبان' },
        { status: 400 }
      );
    }

    const { data: project, error } = await supabaseDocChat.supabase
      .from('ai_projects')
      .insert({
        user_id: userId,
        project_name: projectName,
        project_description: description || '',
        bucket_path: `whatsapp-media/${projectName.toLowerCase()}`
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      project,
      message: 'تم إنشاء المشروع بنجاح'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
