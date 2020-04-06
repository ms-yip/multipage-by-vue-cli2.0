### 使用
``` js
import Uploader from '@/components/uploader/uploader'
import ImgUploader from '@/components/uploader/imgUploader'

export default {
  components: { Uploader, ImgUploader },
  data() {
    return {
      file: '',
      img: '',
    };
  },
};
```

``` html
<Uploader v-model="file" multiple></Uploader>
<ImgUploader v-model="img"></ImgUploader>
```

### Attributes
|     参数    | 说明           | 类型  | 可选值 | 默认值 | 备注|
| ------------- |:-------------:| ----- | ----- | ----- | ----- |
| value | 上传文件的文件ID | String | - | '' | - |
| limit | 最多上传文件数 | Number | - | 0 | 0 即无限制 |
| params | 上传文件时附带的参数 | Object | - | {} | - |
