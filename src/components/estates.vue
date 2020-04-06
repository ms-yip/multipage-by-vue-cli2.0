<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select
          size="small"
          v-model="filter.city"
          placeholder="城市"
          clearable
        >
          <el-option
            v-for="c in citys"
            :label="c.city"
            :value="c.city"
            :key="c.city"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select
          size="small"
          v-model="filter.district"
          placeholder="区"
          clearable
        >
          <el-option
            v-for="d in districtsOptions"
            :label="d.district"
            :value="d.district"
            :key="d.district"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select
          size="small"
          v-model="filter.estateType"
          placeholder="是否时代小区"
          clearable
        >
          <el-option label="时代小区" value="1"></el-option>
          <el-option label="非时代小区" value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-input size="small" v-model="filter.estateName" placeholder="小区名">
        </el-input>
      </el-form-item>
    </el-form>

    <ul class="estates">
      <li v-for="(c, index) in citysFilter" :key="index">
        <em
          :class="c.open ? 'el-icon-minus' : 'el-icon-plus'"
          @click="c.open = !c.open"
        >
        </em>
        <el-checkbox
          v-if="type === 1"
          :label="c.city"
          :value="cityIsChecked(c.city)"
          :indeterminate="cityIsIndeterminate(c.city)"
          @change="checkCity($event, c.city)"
        >
        </el-checkbox>
        <span v-else>{{ c.city }}</span>
        <ul v-if="c.open">
          <li v-for="(d, index) in districtsFilter(c.city)" :key="index">
            <em
              :class="d.open ? 'el-icon-minus' : 'el-icon-plus'"
              @click="d.open = !d.open"
            >
            </em>
            <el-checkbox
              v-if="type === 1"
              :true-label="d.district"
              :label="d.district"
              :value="districtIsChecked(d.district)"
              :indeterminate="districtIsIndeterminate(d.district)"
              @change="checkDistrict(arguments[0], d.district)"
            >
            </el-checkbox>
            <span v-else>{{ d.district }}</span>

            <ul v-if="d.open">
              <li
                v-for="(e, index) in estatesFilter(d.district)"
                track-by="e.id"
                :key="index"
              >
                <label class="el-checkbox">
                  <span
                    v-if="type === 1"
                    class="el-checkbox__input"
                    :class="estateIsChecked(e.id) ? 'is-checked' : ''"
                  >
                    <span class="el-checkbox__inner"> </span>
                    <input
                      type="checkbox"
                      class="el-checkbox__original"
                      v-model="selected"
                      @change="changeEs"
                      :value="e.id"
                  /></span>

                  <span class="el-checkbox__label">{{ e.name }}</span>
                </label>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
  -webkit-padding-start: 0;
}
.estates {
  max-height: 370px;
  overflow-x: hidden;
  overflow-y: auto;
}
.estates em {
  cursor: pointer;
}
.estates > li > ul {
  padding-left: 1.5em;
}
.estates > li > ul > li > ul {
  padding-left: 3em;
}

.estates li li {
  display: block;
  width: unset;
}
</style>

<script type="text/ecmascript-6">
import {getEstate} from '../api/index.js'

export default{
  mounted: function () {
    getEstate().then((response) => {
      // console.log(response)
      if (response.code === '0001') {
        this.citys = []
        this.districts = []
        for (let e in response.data) {
          const record = this.citys.find(function (value, key) {
            return value.city === response.data[e].city
          })

          if (!record) {
            // 没找到,先把城市插进去
            this.citys.push({
              city: response.data[e].city,
              open: false
            })
          }

          const districtRecord = this.districts.find(function (value, key) {
            return value.district === response.data[e].district
          })

          if (!districtRecord) {
            this.districts.push({
              city: response.data[e].city,
              district: response.data[e].district,
              open: false
            })
          }

          this.estates.push(response.data[e])
        }
      } else {
        alert(response.msg)
      }
    }
    )
  },

  props: {
    type: {
      type: Number, // 1 多选 2. 单选
      default: 1
    },
    value: { // 多选
      require: true
    }
  },

  computed: {
    districtsOptions () {
      return !this.filter.city ? this.districts : this.districts.filter((d) => d.city === this.filter.city)
    },
    citysFilter () {
      return !this.filter.city ? this.citys : this.citys.filter((c) => c.city === this.filter.city)
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        if (Array.isArray(val)) {
          this.selected = val
        } else if (typeof val === 'string' && val.length) {
          this.selected = val.split(',')
        } else {
          this.selected = []
        }
      }
    },
    // value (val) {
    //   if (Array.isArray(val)) {
    //     this.selected = val
    //   } else if (typeof val === 'string' && val.length) {
    //     this.selected = val.split(',')
    //   } else {
    //     this.selected = []
    //   }
    // },
    selected (val) {
      if (Array.isArray(this.value)) {
        this.$emit('input', this.selected)
      } else if (typeof this.value === 'string') {
        this.$emit('input', val.join(','))
      }
    }
  },
  data: function () {
    return {
      filter: {
        city: '',
        district: '',
        estateType: '',
        estateName: ''
      },
      districts: [],
      citys: [],
      estates: [],
      selected: []
    }
  },
  methods: {
    changeEs (val) {
      // console.log(val)
      this.$emit('changeChick', {
        checked: val.target.checked,
        value: val.target.value
      })
    },
    districtsFilter (city) {
      return !this.filter.district ? this.districts.filter((d) => d.city === city) : this.districts.filter((d) => d.city === city && d.district === this.filter.district)
    },

    estatesFilter (district) {
      let result = this.estates.filter(e => e.district === district)

      if (this.filter.estateType) {
        result = result.filter(e => e.estate_type === this.filter.estateType)
      }

      if (this.filter.estateName) {
        result = result.filter(e => e.name.indexOf(this.filter.estateName) >= 0)
      }

      return result
    },

    estateIsChecked (estateId) {
      return this.selected.indexOf(estateId) >= 0
    },

    districtIsChecked (district) {
      const districtEstates = this.estates.filter(e => e.district === district)
      return districtEstates.length === districtEstates.filter(e => this.selected.indexOf(e.id) >= 0).length
    },

    districtIsIndeterminate (district) {
      const districtEstates = this.estates.filter(e => e.district === district)
      const selected = districtEstates.filter(e => this.selected.indexOf(e.id) >= 0)
      return (districtEstates.length > selected.length && selected.length > 0)
    },

    cityIsChecked (city) {
      const cityEstates = this.estates.filter(e => e.city === city)
      const selected = cityEstates.filter(e => this.selected.indexOf(e.id) >= 0)
      return cityEstates.length === selected.length
    },

    cityIsIndeterminate (city) {
      const cityEstates = this.estates.filter(e => e.city === city)
      const selected = cityEstates.filter(e => this.selected.indexOf(e.id) >= 0)
      return cityEstates.length > selected.length && selected.length > 0
    },

    checkCity (ev, city) {
      // console.log(ev)
      // console.log(ev.target.checked)
      // ev.target.checked = !this.cityIsChecked(city)
      const cityEstates = this.estates.filter(e => e.city === city)
      cityEstates.forEach(e => {
        const index = this.selected.indexOf(e.id)
        // if (ev.target.checked && index < 0) {
        if (ev && index < 0) {
          this.selected.push(e.id)
        }

        // if (!ev.target.checked && index >= 0) {
        if (!ev && index >= 0) {
          this.selected.splice(index, 1)
        }
      })
    },
    checkDistrict (ev, district) {
      // ev.target.checked = !this.districtIsChecked(district)
      const districtEstates = this.estates.filter(e => e.district === district)
      districtEstates.forEach(e => {
        const index = this.selected.indexOf(e.id)
        // if (ev.target.checked && index < 0) {
        if (ev && index < 0) {
          this.selected.push(e.id)
        }

        // if (!ev.target.checked && index >= 0) {
        if (!ev && index >= 0) {
          this.selected.splice(index, 1)
        }
      })
    }
  }
}
</script>
