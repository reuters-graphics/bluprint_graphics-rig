const path = require('path');

module.exports = {
  slug: {
    required: true,
    inquire: {
      type: 'input',
      message: 'What\'s the slug of this project, e.g., ?',
      validate: (value) => {
        const regex = RegExp('^[A-Za-z0-9/]+(?:-[A-Za-z0-9/]+)*$');
        return regex.test(value) ? true : 'Must be a valid URL slug.';
      },
    },
  },
  seo_title: {
    required: true,
    inquire: {
      type: 'input',
      message: 'What\'s a good SEO title for this project?',
      validate: (value) => value.length <= 60 ?
        true : 'A good title is under 60 characters long.',
    },
  },
  seo_description: {
    required: true,
    inquire: {
      type: 'input',
      message: 'What\'s a good SEO description for this project?',
      validate: (value) => value.length <= 160 ?
        true : 'A good description is under 160 characters long.',
    },
  },
  seo_image: {
    required: true,
    inquire: {
      type: 'fuzzypath',
      required: true,
      message: 'Which is your share image?',
      rootPath: 'src/static/img',
      itemType: 'file',
      excludeFilter: filePath => path.extname(filePath) !== '.jpg',
      validate: (value) => {
        const regex = /^(\.\/)?img\/[A-Za-z0-9]+.(jpg|png)$/;
        return regex.test(value) ?
          true :
          'Please answer with a valid image path that starts with ./img/...';
      },
    },
  },
};
