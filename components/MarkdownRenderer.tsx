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
              {rest && <MarkdownRenderer content={rest} />}
            </div>
          );
        }

        if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
          const lines = paragraph.split('\n');
          return (
            <div key={pIndex} className="space-y-1">
              {lines.map((line, lIndex) => {
                if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                  return (
                    <div key={lIndex} className="flex gap-2 pl-2 md:pl-4">
                      <span className="text-indigo-500 font-bold">&bull;</span>
                      <span className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {processText(line.trim().replace(/^[-*] /, ''))}
                      </span>
                    </div>
                  );
                }
                return (
                  <p key={lIndex} className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {processText(line)}
                  </p>
                );
              })}
            </div>
          );
        }

        return (
          <p key={pIndex} className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {processText(paragraph)}
          </p>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
