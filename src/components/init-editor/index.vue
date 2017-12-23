

<template>
  <div class="editor__wrap">
    <create-editor
      @editor-ready="editorReady"
      @trigger:click:event="TriggerClickEvent"
      :content="content"
      :name="name"
    />
    <inert-video
      v-if="filtersToolbars('insert_video')"
      :visibile.sync="InsertVideoVisibile"
      @insert:html="InsertHtml"
    />
    <inert-image
      v-if="filtersToolbars('insert_image')"
      :visibile.sync="InsertImageVisibile"
      @insert:html="InsertHtml"
    />
    <inert-card
      v-if="filtersToolbars('insert_card')"
      :visibile.sync="InsertCardVisibile"
      @insert:html="InsertHtml"
      ref="inert-card"
    />
    <inert-link
      v-if="filtersToolbars('new_link')"
      :visibile.sync="InsertLinkVisibile"
      @insert:html="InsertHtml"
    />
  </div>
</template>

<script>
	import {mapState, mapActions} from 'vuex'
	import InertVideo from './components/insert-video.vue'
	import InertImage from './components/insert-image.vue'
	import InertCard from './components/insert-card.vue'
	import InertLink from './components/insert-link.vue'
	import ProductList from './product-list'
	import tools from '../../tools'
	import $ from 'jquery'

	export default {
		components: {
			InertVideo,
			InertImage,
			InertCard,
			InertLink
		},
	}
</script>