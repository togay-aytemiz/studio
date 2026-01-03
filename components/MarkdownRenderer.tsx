import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const processText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderBlocks = (text: string, keyPrefix: string) => {
    const lines = text.split('\n');
    const blocks: Array<{ type: 'paragraph' | 'list'; content?: string; items?: string[] }> = [];
    let currentParagraph: string[] = [];
    let currentList: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length) {
        blocks.push({ type: 'paragraph', content: currentParagraph.join(' ') });
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList.length) {
        blocks.push({ type: 'list', items: currentList });
        currentList = [];
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      const isListItem = trimmed.startsWith('- ') || trimmed.startsWith('* ');

      if (isListItem) {
        flushParagraph();
        currentList.push(trimmed.replace(/^[-*]\s+/, ''));
        return;
      }

      if (!trimmed) {
        flushParagraph();
        flushList();
        return;
      }

      flushList();
      currentParagraph.push(trimmed);
    });

    flushParagraph();
    flushList();

    return (
      <div key={keyPrefix} className="space-y-3">
        {blocks.map((block, index) => {
          if (block.type === 'list' && block.items) {
            return (
              <div key={`${keyPrefix}-list-${index}`} className="space-y-1">
                {block.items.map((item, itemIndex) => (
                  <div key={`${keyPrefix}-item-${index}-${itemIndex}`} className="flex gap-2 pl-2 md:pl-4">
                    <span className="text-indigo-500 font-bold">&bull;</span>
                    <span className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {processText(item)}
                    </span>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <p key={`${keyPrefix}-p-${index}`} className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {processText(block.content || '')}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {content.split('\n\n').map((paragraph, pIndex) => {
        if (paragraph.trim().startsWith('###')) {
          const lines = paragraph.split('\n');
          const header = lines[0].replace(/^###\s*/, '');
          const rest = lines.slice(1).join('\n');

          return (
            <div key={pIndex}>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-4 mb-2">
                {header}
              </h4>
              {rest && renderBlocks(rest, `section-${pIndex}`)}
            </div>
          );
        }

        return renderBlocks(paragraph, `paragraph-${pIndex}`);
      })}
    </div>
  );
};

export default MarkdownRenderer;
