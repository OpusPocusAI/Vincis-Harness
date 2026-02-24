# Workers Inbox

**Scan this file at session start.** Messages from Coordinator, Auditor, or other Workers appear here.

**Shared inbox**: All workers read all messages in this file. Only the **To** recipient may mark a message as `DONE` or delete it. Coordinator cleans orphaned messages during merge.

Status lifecycle: `UNREAD` -> `READ` -> `DONE` -> delete.
Mark `DONE` once knowledge is extracted. Delete in the same session.
`STARRED` persists across sprints — do not delete.

Every message MUST include `**From**: {Role}` and `**To**: {Worker X}` headers. Messages without clear sender/recipient are process violations.

<!-- New messages go at the TOP, below this header -->
