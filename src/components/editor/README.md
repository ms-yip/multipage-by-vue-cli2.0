# install

```
npm install --save vue-quill-editor quill-image-resize-module vue-quill-editor-upload quill-image-extend-module quill-video-resize-module
```

<!-- "quill-image-resize-module": "^3.0.0" -->
<!-- "vue-quill-editor": "^3.0.6" -->
<!-- "vue-quill-editor-upload": "^1.1.0" -->
<!-- "quill-image-extend-module": "^1.1.2" -->
<!-- "quill-video-resize-module": "^1.0.2" -->


# vue.config.js configSeetting vue-cli 3.0 

```
webpack.config.js || vue.config.js
configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        "window.Quill": "quill/dist/quill.js",
        Quill: "quill/dist/quill.js"
      })
    ]
  }
```

# import & register quill-editor in main.js

```
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(VueQuillEditor);
```
