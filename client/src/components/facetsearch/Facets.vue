<template>
  <div id="facets">
    <div v-for="facetSetting in facets" v-bind:key="facetSetting.title">
          <FacetText v-if="facetSetting.type=='text'"
                     :facetSetting="facetSetting"
                     :facetStore="facetStore"
                     :state="state"

          >
          </FacetText>
          <!--  <Facet v-for="facetkey in Object.keys(facetStore2)" v-bind:key="facetkey"-->
          <!--         v-bind:facetSetting="facets.find( (obj) => obj.field === facetkey)"-->
          <!--         v-bind:facetStore="facetStore2" >-->
          <!--  </Facet>-->


          <FacetNumericRangeSlider v-if="facetSetting.type=='range'"
                                   :field-name="facetSetting.field"
                     :facetSetting="facetSetting"
                     :facetStore="facetStore"
                     :state="state"
          >
          </FacetNumericRangeSlider>
    </div>
  </div>
</template>

<script>
import FacetText from "./FacetText";
import FacetNumericRangeSlider from "./FacetNumericRangeSlider";

export default {
  name: "Facets",
  components: {
    FacetText,
    FacetNumericRangeSlider
  },
  props: {
    "facetStore": Object,
    "facets": Array,
    "state": Object,
//   "currentResults": Array
  },
  data: function () {
    return {
      facetStore2: this.facetStore,

    }
  },
  methods: {
    //  updateFacets(){
    //   this.$forceUpdate();
    // }
  }
}
</script>

<style scoped>

</style>
