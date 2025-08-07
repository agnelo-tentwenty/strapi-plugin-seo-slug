# Strapi Plugin - SEO Slug (Strapi v5)

> 🔌 A custom field plugin built for **Strapi v5** that helps generate clean, SEO-friendly slugs based on another field in your content type.

## Features

- **Strapi v5 Compatible**
- 🔗 Adds a custom field named **SEO Slug**
- 🔤 Auto-generates slugs based on another field
- ✂️ Optionally strips SEO stopwords (like “the”, “of”, “a”, etc.)
- 🔢 Supports maximum character limit

---

## Screenshots

### Content Manager View  
The SEO Slug field (`Slug`) is auto-generated from `PageTitle` and updates in real-time.

![Content Manager](https://raw.githubusercontent.com/agnelonicolaus1020/strapi-plugin-seo-slug/refs/heads/main/screens/generateSlug.gif)

---

### Field Configuration - Basic Settings  
Choose the source field for slug generation.

![Basic Settings](https://raw.githubusercontent.com/agnelonicolaus1020/strapi-plugin-seo-slug/refs/heads/main/screens/baseOptions.png)

---

### Field Configuration - Advanced Settings  
Enable stopword removal and set maximum slug length.

![Advanced Settings](https://raw.githubusercontent.com/agnelonicolaus1020/strapi-plugin-seo-slug/refs/heads/main/screens/advancedOptions.png)

---

## Installation

```bash
npm install strapi-plugin-seo-slug
```

## Configuration

### Enable the plugin

The plugin configuration is stored in a config file located at ./config/plugins.js. If this file doesn't exists, you will need to create it.

A sample configuration

```javascript
export default ({ env }) => ({
  "strapi-plugin-seo-slug": {
    enabled: true,
  }
});
```