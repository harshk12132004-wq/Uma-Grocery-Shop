const fs = require('fs');
const path = 'E:\\Shop Sales Uma\\backend\\api\\serializers.py';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    /fields = \['id', 'name', 'description', 'image_url', 'product_count'\]/,
    "fields = ['id', 'name', 'description', 'image_url', 'dedicated_image_url', 'product_count']"
);

fs.writeFileSync(path, content, 'utf8');
console.log('Updated serializers.py');
