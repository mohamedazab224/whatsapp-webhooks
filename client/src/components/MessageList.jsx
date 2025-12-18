import "./MessageList.css"

function MessageList({ messages }) {
  const sortedMessages = [...messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="message-list">
      {sortedMessages.map((msg) => (
        <div key={msg.id || msg.createdAt} className={`message-item ${msg.direction}`}>
          <div className="message-header">
            <span className="message-direction">{msg.direction === "incoming" ? "واردة" : "صادرة"}</span>
            <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString("ar-SA")}</span>
          </div>
          <div className="message-contact">{msg.direction === "incoming" ? `من: ${msg.from}` : `إلى: ${msg.to}`}</div>
          <div className="message-body">{msg.text}</div>
        </div>
      ))}
    </div>
  )
}

export default MessageList
