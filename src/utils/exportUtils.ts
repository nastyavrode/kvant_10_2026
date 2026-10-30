import { Note } from '../types';

export function exportToMarkdown(note: Note): void {
  let md = `# ${note.title}\n\n`;
  md += `> Автор: ${note.authorName}\n`;
  md += `> Обновлено: ${new Date(note.updatedAt).toLocaleDateString('ru-RU')}\n\n`;
  md += `---\n\n`;

  note.blocks.forEach(block => {
    switch (block.type) {
      case 'heading':
        md += `## ${block.content}\n\n`;
        break;
      case 'text':
        md += `${block.content}\n\n`;
        break;
      case 'markdown':
        md += `${block.content}\n\n`;
        break;
      case 'code':
        md += `\`\`\`\n${block.content}\n\`\`\`\n\n`;
        break;
      case 'formula':
        md += `$$\n${block.content}\n$$\n\n`;
        break;
      case 'image':
        md += `![image](${block.content})\n\n`;
        break;
    }
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${note.title.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(): void {
  window.print();
}
