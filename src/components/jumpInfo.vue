<template>
  <el-form ref="form">
    <el-form-item label="跳转链接">
      <el-select
        size="small"
        :disabled="disabled"
        v-model="jumpId"
        placeholder="跳转链接"
      >
        <!-- <template > -->
          <el-option :label="selection.module_name" :value="key" v-for="(selection, key) in jumpInfo" :key="key"> </el-option>
        <!-- </template> -->
      </el-select>
    </el-form-item>
    <template v-if="jumpId && jumpInfo[jumpId] && jumpInfo[jumpId].and_params">
      <el-form-item
        :label="'Android：' + x"
        v-for="(x, xIndex) in jumpInfo[jumpId].and_params" :key="xIndex"
      >
        <el-input
          :disabled="disabled"
          size="small"
          v-model="params.and[x]"
          :placeholder="x"
        >
        </el-input>
      </el-form-item>
    </template>

    <template v-if="jumpId && jumpInfo[jumpId] && jumpInfo[jumpId].ios_params">
      <el-form-item
        :label="'IOS：' + x"
        v-for="(x, xIndex) in jumpInfo[jumpId].ios_params" :key="xIndex"
      >
        <el-input
          size="small"
          v-model="params.ios[x]"
          :placeholder="x"
          :disabled="disabled"
        >
        </el-input>
      </el-form-item>
    </template>
  </el-form>
</template>

<script lang="babel">
import {getJumpInfo} from '../api/index.js'

const isEmptyObject = function (obj) {
  let i = 0
  /*eslint-disable*/
  for (let k in obj) {
    // console.log(k)
    i++
  }
  /* eslint-enable */
  return i === 0
}
export default{
  mounted () {
    getJumpInfo().then((response) => {
      if (response.code === '0001') {
        this.jumpInfo = response.data
      }
    })
  },
  data () {
    return {
      jumpInfo: {},
      jumpId: null,
      params: {and: {}, ios: {}}
    }
  },
  computed: {
    realValue () {
      const val = {}
      if (this.keyArray[0]) {
        val[this.keyArray[0]] = this.jumpId
      }
      if (this.keyArray[1]) {
        val[this.keyArray[1]] = typeof this.value[this.keyArray[1]] === 'string' ? JSON.stringify(this.params) : this.params
      }

      return val
    }
  },
  props: {
    value: {require: true},
    keyArray: {
      type: Array,
      default () {
        return ['jumpId', 'params']
      }
    },
    disabled: {type: Boolean}
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler (val) {
        console.log(val)
        if (this.keyArray[0] && val[this.keyArray[0]]) {
          this.jumpId = val[this.keyArray[0]]
        }

        if (this.keyArray[1] && val[this.keyArray[1]]) {
          this.params = typeof val[this.keyArray[1]] === 'string' ? JSON.parse(val[this.keyArray[1]]) : val[this.keyArray[1]]
        }
      }
    },
    jumpId (jumpId) {
      if (isEmptyObject(this.jumpInfo)) {
        return
      }

      const params = {and: {}, ios: {}}
      let valueObject = {and: {}, ios: {}}
      if (this.value[this.keyArray[1]]) {
        valueObject = typeof this.value[this.keyArray[1]] === 'string' ? JSON.parse(this.value[this.keyArray[1]]) : this.value[this.keyArray[1]]
      }

      if (jumpId && this.jumpInfo[jumpId] && this.jumpInfo[jumpId].and_params) {
        this.jumpInfo[jumpId].and_params.forEach(p => {
          if (this.params.and && this.params.and[p]) {
            params.and[p] = this.params.and[p]
          } else if (this.value.and && valueObject.and[p]) {
            params.and[p] = valueObject.and[p]
          } else {
            params.and[p] = ''
          }
        })
      }

      if (jumpId && this.jumpInfo[jumpId] && this.jumpInfo[jumpId].ios_params) {
        this.jumpInfo[jumpId].ios_params.forEach(p => {
          if (this.params.ios && this.params.ios[p]) {
            params.ios[p] = this.params.ios[p]
          } else if (this.value.ios && valueObject.ios[p]) {
            params.ios[p] = valueObject.ios[p]
          } else {
            params.ios[p] = ''
          }
        })
      }

      this.params = params
    },
    realValue: {
      deep: true,
      handler (val) {
        // 传递的value是空对象
        if (isEmptyObject(val)) {
          return
        }

        // 没有jumpId
        if (!this.keyArray[0]) {
          return
        }

        // 不要params，只要jumpId且jumpId的值与value对象上的jumpId的值不同
        if (!this.keyArray[1] && this.value[this.keyArray[0]] && this.value[this.keyArray[0]] !== val[this.keyArray[0]]) {
          this.$emit('input', val)
        }

        // 两者都要
        if ((this.keyArray[0] && this.value[this.keyArray[0]] && this.value[this.keyArray[0]] !== val[this.keyArray[0]]) ||
                        (this.keyArray[1] && val[this.keyArray[1]] && this.value[this.keyArray[1]] !== val[this.keyArray[1]])) {
          this.$emit('input', val)
        }
      }
    }
  }
}
</script>
