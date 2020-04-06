<template>
  <div class="table-grid-cell" ref="cell">
    <cell> </cell>
  </div>
</template>
<style scoped></style>
<script type="text/ecmascript-6">
/*eslint-disable*/
export default {
  props: {
    row: Object,
    column: Object,
    index: Number,
  },
  components: {
    cell: {
      render(h) {
        const self = this.$parent;
        return self.column.render(h, {
          row: self.row,
          column: self.column,
          index: self.index,
        });
      },
    },
  },
};
</script>
