import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Info, TrendingUp, AlertTriangle } from "lucide-react";

interface AIFormattedTextProps {
  text: string;
}

export const AIFormattedText = ({ text }: AIFormattedTextProps) => {
  const formatText = (content: string) => {
    const elements: JSX.Element[] = [];
    const lines = content.split('\n');
    let currentList: JSX.Element[] = [];
    let listType: 'bullet' | 'number' | null = null;
    let key = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          listType === 'number' ? (
            <ol key={`list-${key++}`} className="list-decimal list-inside space-y-2 my-3 ml-4">
              {currentList}
            </ol>
          ) : (
            <ul key={`list-${key++}`} className="list-none space-y-2 my-3">
              {currentList}
            </ul>
          )
        );
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, lineIndex) => {
      if (!line.trim()) {
        flushList();
        return;
      }

      const bulletMatch = line.match(/^[\s]*[•\-\*]\s+(.+)$/);
      const numberMatch = line.match(/^[\s]*(\d+)\.\s+(.+)$/);
      const headingMatch = line.match(/^#+\s+(.+)$/);
      const boldMatch = line.match(/\*\*(.+?)\*\*/g);

      if (bulletMatch) {
        if (listType !== 'bullet') {
          flushList();
          listType = 'bullet';
        }
        currentList.push(
          <li key={`item-${lineIndex}`} className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span className="flex-1">{parseInlineFormatting(bulletMatch[1])}</span>
          </li>
        );
      } else if (numberMatch) {
        if (listType !== 'number') {
          flushList();
          listType = 'number';
        }
        currentList.push(
          <li key={`item-${lineIndex}`} className="ml-2">
            {parseInlineFormatting(numberMatch[2])}
          </li>
        );
      } else if (headingMatch) {
        flushList();
        elements.push(
          <h4 key={`heading-${lineIndex}`} className="text-base font-bold text-foreground mt-4 mb-2">
            {parseInlineFormatting(headingMatch[1])}
          </h4>
        );
      } else {
        flushList();

        if (line.toLowerCase().includes('risk score:') || line.toLowerCase().includes('risk level:')) {
          const riskMatch = line.match(/(high|medium|low)/i);
          const icon = riskMatch?.[1].toLowerCase() === 'high' ? <AlertCircle className="w-4 h-4" /> :
                       riskMatch?.[1].toLowerCase() === 'medium' ? <AlertTriangle className="w-4 h-4" /> :
                       <CheckCircle className="w-4 h-4" />;
          const badgeColor = riskMatch?.[1].toLowerCase() === 'high' ? 'bg-destructive/20 text-destructive border-destructive/50' :
                             riskMatch?.[1].toLowerCase() === 'medium' ? 'bg-warning/20 text-warning border-warning/50' :
                             'bg-success/20 text-success border-success/50';

          elements.push(
            <div key={`risk-${lineIndex}`} className={`flex items-center gap-2 p-3 rounded-lg border my-2 ${badgeColor}`}>
              {icon}
              <span className="font-semibold">{parseInlineFormatting(line)}</span>
            </div>
          );
        } else if (line.match(/^\d+%|\d+\/\d+/)) {
          elements.push(
            <div key={`stat-${lineIndex}`} className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/30 my-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary">{parseInlineFormatting(line)}</span>
            </div>
          );
        } else if (line.toLowerCase().includes('recommendation') || line.toLowerCase().includes('suggest')) {
          elements.push(
            <div key={`rec-${lineIndex}`} className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30 my-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5" />
              <span>{parseInlineFormatting(line)}</span>
            </div>
          );
        } else {
          elements.push(
            <p key={`p-${lineIndex}`} className="my-2 leading-relaxed">
              {parseInlineFormatting(line)}
            </p>
          );
        }
      }
    });

    flushList();
    return elements;
  };

  const parseInlineFormatting = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(/\*(.+?)\*/);
      const codeMatch = remaining.match(/`(.+?)`/);

      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(remaining.substring(0, boldMatch.index));
        }
        parts.push(
          <strong key={`bold-${key++}`} className="font-bold text-foreground">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.substring(boldMatch.index + boldMatch[0].length);
      } else if (italicMatch && italicMatch.index !== undefined && !remaining.startsWith('**')) {
        if (italicMatch.index > 0) {
          parts.push(remaining.substring(0, italicMatch.index));
        }
        parts.push(
          <em key={`italic-${key++}`} className="italic text-muted-foreground">
            {italicMatch[1]}
          </em>
        );
        remaining = remaining.substring(italicMatch.index + italicMatch[0].length);
      } else if (codeMatch && codeMatch.index !== undefined) {
        if (codeMatch.index > 0) {
          parts.push(remaining.substring(0, codeMatch.index));
        }
        parts.push(
          <code key={`code-${key++}`} className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.substring(codeMatch.index + codeMatch[0].length);
      } else {
        parts.push(remaining);
        break;
      }
    }

    return parts;
  };

  return (
    <div className="text-sm text-foreground/90 space-y-1">
      {formatText(text)}
    </div>
  );
};
