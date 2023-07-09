---
layout: layout.njk
eleventyExcludeFromCollections: true
---

<ul class="category">
   {% for tuple in collections.categories | dictsort %}
      <li>{{ tuple[0] }}
      <ul>
         {% for recipe in tuple[1] %}
      <li><a href="{{ recipe.url }}">{{ recipe.data.title }}</a></li>
   {% endfor %}
</ul>
   {% endfor %}
</ul>
