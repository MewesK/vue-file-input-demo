<script lang="ts">
import { defineComponent, PropType } from "vue";
import CropDialog from "./CropDialog.vue";

/**
 * @params {File[]} files Array of files to convert to a FileList
 * @return {FileList}
 */
function createFileList(files: Array<File>): FileList | null {
  if (files.length === 0) {
    return null;
  }

  // Since we can not create a new FileList directly, we create a DataTransfer object,
  // add drag data and let the browser create a new FileLIst for us.
  let dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
}

export default defineComponent({
  components: { CropDialog },
  setup() {
    return { URL };
  },
  emits: ["update:modelValue"],
  props: {
    modelValue: Object as PropType<FileList | null>,
  },
  data() {
    return {
      cropFile: null as File | null,
      cropIndex: null as number | null,
    };
  },
  methods: {
    cropHandler() {
      if (
        !this.modelValue ||
        this.cropIndex === null ||
        this.cropFile === null
      ) {
        return;
      }

      // Overwrite file with cropped version
      const fileArray = Array.from(this.modelValue);
      fileArray[this.cropIndex] = this.cropFile;

      this.$emit("update:modelValue", createFileList(fileArray));
    },
    removeHandler(index: number) {
      if (!this.modelValue) {
        return;
      }

      const fileArray = Array.from(this.modelValue);
      fileArray.splice(index, 1);

      this.$emit("update:modelValue", createFileList(fileArray));
    },
  },
});
</script>

<template>
  <ul v-if="modelValue">
    <li v-for="(file, index) in modelValue">
      <template v-if="file.type.startsWith('image/')">
        <img
          :src="URL.createObjectURL(file)"
          :alt="`Preview of ${file.name}`"
          :title="`Preview of ${file.name}`"
        />
      </template>
      <div>
        📄 {{ file.name }}
        <small>({{ file.size }} byte, {{ file.type || "unknown" }})</small>
        &nbsp;
        <button
          v-if="file.type.startsWith('image/')"
          type="button"
          title="Crop"
          @click="
            cropFile = file;
            cropIndex = index;
          "
        >
          ✂
        </button>
        <button type="button" title="Remove" @click="removeHandler(index)">
          🗑
        </button>
      </div>
    </li>
  </ul>
  <CropDialog
    v-model="cropFile"
    @cancel="
      cropFile = null;
      cropIndex = null;
    "
    @update:model-value="cropHandler"
  />
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  clear: both;
}

img {
  max-width: 150px;
  max-height: 150px;
  margin-top: 10px;
}

button {
  padding: 4px;
  font-size: 0.8rem;
  line-height: 1.1rem;
  filter: grayscale(1);
}

button:hover {
  filter: grayscale(0);
}
</style>
