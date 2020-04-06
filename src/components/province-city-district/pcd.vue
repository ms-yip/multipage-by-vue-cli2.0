<template>
  <div class="pcd-panel">
    <el-select :value="province" placeholder="省" @input="val => changeHander(0, val)" :style="style" :disabled="disabled">
      <el-option :value="p.id+''" v-for="p in provinceList" :key="p.id" :label="p.name"></el-option>
    </el-select>
    <el-select :value="city" placeholder="市" @input="val => changeHander(1, val)" :style="style" :disabled="disabled">
      <el-option :value="c.id+''" v-for="c in cityList" :key="c.id" :label="c.name"></el-option>
    </el-select>
    <el-select :value="district" placeholder="区/县" @input="val => changeHander(2, val)" :style="style" :disabled="disabled">
      <el-option :value="d.id+''" v-for="d in districtList" :key="d.id" :label="d.name"></el-option>
    </el-select>
  </div>
</template>

<script type="text/ecmascript-6">
const type = ['province', 'city', 'district']

export default {
  name: 'ProvinceCityDistrict',
  components: {},
  data () {
    return {
      provinceList: [],
      cityList: [],
      districtList: [],
      style: {
        width: `${this.width}px`
      }
    }
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    province: {
      type: String,
      default () {
        return ''
      }
    },
    city: {
      type: String,
      default () {
        return ''
      }
    },
    district: {
      type: String,
      default () {
        return ''
      }
    },
    width: {
      type: Number,
      default () {
        return 90
      }
    }
  },
  watch: {
    province: 'getCity',
    city: 'getDistrict'
  },
  created () {
    this.getProvince()
    if (this.province) {
      this.getCity()
    }
    if (this.city) {
      this.getDistrict()
    }
  },
  methods: {
    changeHander (index, value) {
      if (index === 0) {
        this.$emit('update:city', '')
        this.$emit('update:district', '')
      } else if (index === 1) {
        this.$emit('update:district', '')
      }
      this.$emit(`update:${type[index]}`, value)
    },
    getProvince () {
      const api = '/qwerty.php/Linlimall/AreaManage/getProvince'
      this.$http.get(api).then((res) => {
        const success = res.code === '0001'
        if (success) {
          this.provinceList = res.data
        } else {
          this.$notify.error(res.msg)
        }
      })
    },
    getCity () {
      const api = '/qwerty.php/Linlimall/AreaManage/getCity'
      if (this.province) {
        this.$http.get(api, {
          params: { province: this.province }
        }).then((res) => {
          const success = res.code === '0001'
          if (success) {
            this.cityList = res.data
          } else {
            // this.$notify.error(res.msg);
          }
        })
      }
    },
    getDistrict () {
      const api = '/qwerty.php/Linlimall/AreaManage/getArea'
      if (this.city) {
        this.$http.get(api, {
          params: { city: this.city }
        }).then((res) => {
          const success = res.code === '0001'
          if (success) {
            this.districtList = res.data
          } else {
            this.districtList = []
            // this.$notify.error(res.msg)
          }
        })
      }
    }
  }
}

</script>
<style scoped></style>
