const MONETIZATION_HEADING_RE = /(gelir modeli|gelir stratejisi|monetization( strategy)?|revenue (model|strategy)|pricing strategy)/i;

const stripLeadingHeading = (content: string, shouldStrip: (heading: string) => boolean) => {
  if (!content) return content;

  const lines = content.split('\n');
  let index = 0;

  while (index < lines.length && !lines[index].trim()) {
    index += 1;
  }

  if (index >= lines.length) return content;

  const line = lines[index].trim();
  const match = line.match(/^#{1,6}\s+(.*)$/);
  if (!match) return content;

  const headingText = match[1].trim();
  if (!shouldStrip(headingText)) return content;

  index += 1;
  while (index < lines.length && !lines[index].trim()) {
    index += 1;
  }

  return lines.slice(index).join('\n');
};

export const stripRedundantMonetizationHeading = (content: string) =>
  stripLeadingHeading(content, (heading) => MONETIZATION_HEADING_RE.test(heading));
