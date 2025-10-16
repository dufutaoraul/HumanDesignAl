function formatEnglishName(name) {
  if (!name) return '';

  if (name.includes(' ') && /^[A-Z]/.test(name) && /[a-z]/.test(name)) {
    return name;
  }

  if (name === name.toUpperCase()) {
    let formatted = name.toLowerCase();

    formatted = formatted
      .replace(/thegardenofeden/g, 'the garden of eden')
      .replace(/themaya/g, 'the maya')
      .replace(/thesphinx/g, 'the sphinx')
      .replace(/thevessellove/g, 'the vessel love')
      .replace(/the([a-z]{2,})/g, (match, p1) => {
        if (formatted.includes(match)) {
          return `the ${p1}`;
        }
        return match;
      })
      .replace(/of([a-z]{2,})/g, (match, p1) => {
        return `of ${p1}`;
      })
      .replace(/and([a-z]{2,})/g, (match, p1) => {
        return `and ${p1}`;
      });

    formatted = formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    if (!formatted.includes(' ')) {
      formatted = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    return formatted;
  }

  return name;
}

console.log('THEMAYA ->', formatEnglishName('THEMAYA'));
console.log('THEGARDENOFEDEN ->', formatEnglishName('THEGARDENOFEDEN'));
console.log('EDUCATION ->', formatEnglishName('EDUCATION'));
console.log('The Maya ->', formatEnglishName('The Maya'));
console.log('Direction(The Sphinx) ->', formatEnglishName('Direction(The Sphinx)'));
