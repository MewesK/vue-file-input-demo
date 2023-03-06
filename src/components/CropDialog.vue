<script lang="ts">
import { defineComponent, PropType } from "vue";
import Cropper from "cropperjs";

export default defineComponent({
  setup() {
    return { URL };
  },
  emits: ["cancel", "update:modelValue"],
  props: {
    modelValue: { type: Object as PropType<File | null>, default: null },
  },
  data() {
    return {
      cropper: null as Cropper | null,
      loaded: false,
    };
  },
  methods: {
    saveHandler() {
      if (!this.modelValue) {
        return;
      }

      // Get crop dimensions
      const dimensions = this.cropper?.getData(true);
      if (!dimensions) {
        return;
      }

      // Create canavs
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      // Draw cropped image onm canvas
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      ctx.drawImage(
        this.$refs.image as HTMLImageElement,
        dimensions.x,
        dimensions.y,
        dimensions.width,
        dimensions.height,
        0,
        0,
        dimensions.width,
        dimensions.height
      );

      // Convert canvas to blob
      const name = this.modelValue.name;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            this.$emit(
              "update:modelValue",
              new File([blob], name, {
                type: "image/jpeg",
              })
            );
            this.$emit("cancel");
          }
        },
        "image/jpeg",
        0.9
      );
    },
  },
  watch: {
    async modelValue(value, oldValue) {
      if (value === null) {
        // Close modal
        (this.$refs.dialog as HTMLDialogElement).close();

        // Reset data
        this.cropper = null;
        this.loaded = false;
      } else if (value !== oldValue) {
        // Wait for this.$refs.image to update
        await this.$nextTick();

        // Create cropper
        this.cropper = new Cropper(this.$refs.image as HTMLImageElement, {
          guides: false,
          movable: false,
          rotatable: false,
          scalable: false,
          toggleDragModeOnDblclick: false,
          zoomable: false,
        });

        // Show modal
        (this.$refs.dialog as HTMLDialogElement).showModal();
      }
    },
  },
});
</script>

<template>
  <dialog v-if="modelValue" ref="dialog">
    <header>Crop "{{ modelValue.name }}"</header>
    <div>
      <img
        ref="image"
        :src="URL.createObjectURL(modelValue)"
        :alt="`${modelValue.name}`"
        :title="`${modelValue.name}`"
        @load="loaded = true"
      />
    </div>
    <footer>
      <button type="button" @click="saveHandler">Crop</button>
      <button type="button" @click="$emit('cancel')">Cancel</button>
    </footer>
  </dialog>
</template>

<style scoped>
dialog {
  padding: 10px 20px;
}

dialog header {
  margin: -10px -20px 10px;
}

div {
  margin-top: 20px;
}

img {
  display: block;
  max-width: 80vw;
  max-height: 80vh;
}

footer {
  clear: both;
}

footer button {
  float: right;
  margin: 10px 0 10px 10px;
}
</style>
