---
layout: layout.njk
eleventyExcludeFromCollections: true
---
# Most Recent Recipes
<ul>
{%- for post in collections.all | reverse -%}
  <li><a href="{{ post.url }}">{{ post.data.title }}</a> [{{post.data.date | dtFormat }}]</li>
{%- endfor -%}
</ul>