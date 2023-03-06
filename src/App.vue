<script lang="ts">
import { defineComponent } from "vue";

import FileInput from "./components/FileInput.vue";
import FileList from "./components/FileList.vue";

export default defineComponent({
  components: { FileInput, FileList },
  data() {
    return {
      avatar1: null as FileList | null,
      avatar2: null as FileList | null,
      avatar3: null as FileList | null,
    };
  },
  methods: {
    resetHandler() {
      this.avatar1 = null;
      this.avatar2 = null;
      this.avatar3 = null;
    },
    submitHandler(event: Event) {
      // Output form data
      const formData = new FormData(event.target as HTMLFormElement);
      for (const [key, value] of formData) {
        console.log('submitted => ', key, value);
      }
    },
  },
  watch: {
    avatar1(value: FileList | null) {
      console.log('avatar1 got updated to => ', value);
    },
    avatar2(value: FileList | null) {
      console.log('avatar2 got updated to => ', value);
    },
    avatar3(value: FileList | null) {
      console.log('avatar3 got updated to => ', value);
    },
  },
});
</script>

<template>
  <form class="pure-form" method="POST" enctype="multipart/form-data" @submit="submitHandler">
    <div class="form-row">
      <label for="avatar1">Single file, all default</label>
      <FileInput
        v-model="avatar1"
        id="avatar1"
        name="avatar1"
        class="file-input"
      />
    </div>

    <div class="form-row">
      <label for="avatar2">
        Multiple files, accepts: image/png, image/jpeg, application/pdf,
        max-size: 1MB
      </label>
      <FileInput
        v-model="avatar2"
        id="avatar2"
        name="avatar2"
        class="file-input"
        accept="image/png, image/jpeg, application/pdf"
        :max-size="1048576"
        multiple
      />
    </div>

    <div class="form-row">
      <label for="avatar2a"> Capture mode "user", single file </label>
      <FileInput
        v-model="avatar2"
        id="avatar2a"
        name="avatar2a"
        class="file-input"
        accept="image/*"
        capture="user"
      />
    </div>

    <div class="form-row">
      <label for="avatar3">
        Multiple files with preview, custom drop are, accepts: image/png,
        image/jpeg, image/gif, video/*, .pdf
      </label>
      <FileInput
        v-model="avatar3"
        id="avatar3"
        name="avatar3"
        class="file-input"
        style="cursor: default"
        accept="image/png, image/jpeg, image/gif, video/*, .pdf"
        multiple
      >
        Drop files here
        <div class="form-divider">or</div>
        <button type="button">Click here to choose files</button>
      </FileInput>
      <FileList v-model="avatar3" />
      <div class="form-text">
        Must be JPEG, PNG, or GIF and cannot exceed 10MB.
      </div>
    </div>

    <input type="submit" value="Submit" />
    <input type="reset" value="Reset" />
    <input type="button" value="JS Reset" @click="resetHandler" />
  </form>
</template>

<style scoped>
.form-row {
  margin-bottom: 6px;
}

/*
 * Custom drop area
 */

.form-divider {
  display: flex;
  align-items: center;
  --form-divider-gap: 1rem;
  width: 20%;
  margin: 10px auto;
  color: var(--form-placeholder);
}

.form-divider::before,
.form-divider::after {
  content: "";
  height: 1px;
  background-color: var(--form-placeholder);
  flex-grow: 1;
}

.form-divider::before {
  margin-right: var(--form-divider-gap);
}

.form-divider::after {
  margin-left: var(--form-divider-gap);
}

.form-text {
  color: var(--form-placeholder);
  font-size: 0.8em;
}
</style>
