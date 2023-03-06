<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  setup() {
    return { URL };
  },
  emits: ["update:modelValue"],
  props: {
    modelValue: Object as PropType<FileList | null>,
    accept: { type: String, default: "" },
    capture: {
      type: Object as PropType<boolean | "user" | "environment">,
    },
    maxSize: { type: Number, default: null },
    multiple: { type: Boolean, default: false },
    name: { type: String, required: true },
  },
  data() {
    return {
      active: false,
    };
  },
  mounted() {
    this.form?.addEventListener("reset", this.resetHandler);
  },
  unmounted() {
    this.form?.removeEventListener("reset", this.resetHandler);
  },
  computed: {
    mimeList(): Array<string> {
      // Create list with all accepted mime types
      return !this.accept
        ? []
        : this.accept
            .split(",")
            .map((token) => token.trim())
            .filter((token) => !token.startsWith("."));
    },
    suffixList(): Array<string> {
      // Create a list with all accepted suffixes
      return !this.accept
        ? []
        : this.accept
            .split(",")
            .map((token) => token.trim())
            .filter((token) => token.startsWith("."));
    },
    form(): HTMLFormElement | null {
      return this.$el.closest("form");
    },
    input(): HTMLInputElement {
      return this.$refs.input as HTMLInputElement;
    },
  },
  methods: {
    validateFiles(fileList: FileList): boolean {
      // Validate "multiple"
      if (!this.multiple && fileList.length > 1) {
        console.error(`Only one file is allowed.`);
        return false;
      }
      return Array.from(fileList).every(this.validateFile);
    },
    validateFile(file: File): boolean {
      // Validate "maSize"
      if (this.maxSize !== null && file.size > this.maxSize) {
        console.error(
          `${file.name} is bigger than the allowed maximum size of ${this.maxSize} bytes.`
        );
        return false;
      }

      // Validate "accept"
      if (this.accept) {
        // Check suffixes
        if (
          this.suffixList.length === 0 ||
          !this.suffixList.some((suffix) => file.name.endsWith(suffix))
        ) {
          // Check mime types
          if (
            this.mimeList.length === 0 ||
            !this.mimeList.some((mime) =>
              mime.includes("*")
                ? file.type.match(mime)
                : file.type.toLowerCase() === mime.toLowerCase()
            )
          ) {
            console.error(`${file.name} has an invalid type.`);
            return false;
          }
        }
      }

      return true;
    },
    changeHandler(event: Event) {
      const files = (event.target as HTMLInputElement).files;

      // Validate file
      if (files) {
        this.validateFiles(files);
      }

      this.$emit("update:modelValue", files);
    },
    dropHandler(event: DragEvent) {
      this.active = false;
      const files = event.dataTransfer?.files ?? null;

      // Validate file
      if (files) {
        this.validateFiles(files);
      }

      this.$emit("update:modelValue", files);
      this.input.files = files;
    },
    resetHandler() {
      this.$emit("update:modelValue", null);
    },
  },
  watch: {
    modelValue(value: FileList | null) {
      if (value === null) {
        // Reset input element
        this.input.value = "";
      }
    },
  },
});
</script>

<template>
  <div
    :class="{ active }"
    @click="input.click()"
    @drop.prevent="dropHandler"
    @dragover.prevent="active = true"
    @dragleave="active = false"
  >
    <slot>
      {{
        multiple
          ? "Drop files here or click to choose files"
          : "Drop file here or click to choose file"
      }}
    </slot>
    <input
      type="file"
      ref="input"
      :accept="accept"
      :capture="capture"
      :multiple="multiple"
      :name="name"
      @change="changeHandler"
    />
  </div>
</template>

<style scoped>
div {
  padding: 10px;
  border: 3px dashed var(--background);
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
}

.active {
  background-color: var(--background-alt);
}

input {
  display: none;
}
</style>
