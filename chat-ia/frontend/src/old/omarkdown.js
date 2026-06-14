/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// import Showdown from 'showdown';
const showdown  = require('showdown');

/**
 * Strips latex bracket formats and formats equations into HTML italic elements
 */
const latexToHtml = (text) => {
  return text.replace(/\$+(.*?)\$+/g, (_match, value) => {
    const html = value
      .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '($1)/($2)')
      .replace(/\\text\{(.*?)\}/g, '$1')
      .replace(/\\times/g, '*')
      .replace(/\s\\%/g, '%');
    return '<i>' + html + '</i>';
  });
};

/**
 * Renders raw markdown text into safe HTML strings using Showdown
 */
export const renderMarkdownToHtml = (text) => {
  if (!text) return '';
  const processedText = latexToHtml(text);
  
  const converter = new showdown.Converter({
    optionKey: 'value',
    tables: true,
    strikethrough: true,
    ghCodeBlocks: true,
    emoji: true,
    simpleLineBreaks: true,
  });
  
  return converter.makeHtml(processedText);
};
