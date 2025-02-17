<template>
  <div v-if="editor" class="break-words border-2 border-gray-800 rounded-xl">
    <slot></slot>
    <MenuBar
      class="sticky top-[-26px] bg-white z-10 flex items-center p-2 border-y-2 border-gray-800 print:hidden"
      :editor="editor"
    />

    <EditorContent ref="tiptap" :editor="editor" class="break-words" />
    <div
      class="flex items-center justify-between px-2 py-1 text-gray-800 border-t-2 border-gray-800 print:hidden"
    >
      <div class="space-x-4">
        <span class="text-sm">{{ room }}:</span>
        <span
          v-for="item in editor.storage.collaborationCursor.users"
          :key="item.clientId"
          class="text-sm"
        >
          {{ item.name }}
        </span>
      </div>
      <div class="text-sm">
        {{ editor.storage.characterCount.characters() }} characters
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import MenuBar from "./FormMenuBar.vue";
import { defineComponent } from "vue";
import { useUserStore } from "@/store/user";

export default defineComponent({
  components: {
    EditorContent,
    MenuBar,
  },
  props: {
    room: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: "",
      required: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      provider: null as null | WebrtcProvider,
      editor: null as null | Editor,
      users: [] as { [key: string]: any; clientId: number }[], // eslint-disable-line @typescript-eslint/no-explicit-any
      setup: false,
      initial: "" as string,
    };
  },
  computed: {
    user() {
      const store = useUserStore();
      return store.user;
    },
    editorUser() {
      return {
        name: this.user?.name,
        color: this.getRandomColor(),
      };
    },
  },
  // watch: {
  //   modelValue: function (newValue, oldValue) {
  //     if (
  //       newValue.length > 0 &&
  //       oldValue.length > 0 &&
  //       newValue.length % oldValue.length === 0 &&
  //       newValue.length !== oldValue.length
  //     ) {
  //       this.editor?.commands.setContent(oldValue);
  //     } else if (newValue !== oldValue && !this.setup) {
  //       this.editor?.commands.setContent(newValue);
  //       this.setup = true;
  //     }
  //   },
  // },
  watch: {
    modelValue(value) {
      if (this.editor === null) return;

      const isDifferent = this.editor.getHTML() !== value;
      if (isDifferent) this.setEditorContent(value);

      const isInitialMultiple =
        value.includes(this.initial) &&
        value.length % this.initial.length === 0 &&
        value.length > this.initial.length;
      if (isInitialMultiple) this.setEditorContent(this.initial);
    },
  },
  mounted() {
    this.initial = this.modelValue;

    const ydoc = new Y.Doc();

    const userStore = useUserStore();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.provider = new WebrtcProvider(this.room, ydoc, {
      password: `${userStore.rlc?.id}${userStore.rlc?.name}`,
      signaling: ["wss://y-webrtc-signaling-eu.herokuapp.com/"],
    });

    this.editor = new Editor({
      editorProps: {
        attributes: {
          class: "prose p-5 w-full focus:outline-none sm:max-w-none",
        },
      },
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Highlight.configure({ multicolor: true }),
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider: this.provider,
          user: this.editorUser,
        }),
        CharacterCount.configure({
          limit: 10000,
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
      ],
      onUpdate: () => {
        this.$emit(
          "update:modelValue",
          this.editor ? this.editor.getHTML() : "",
        );
      },
    });

    this.setEditorContent(this.modelValue);
  },
  beforeUnmount() {
    if (this.editor) this.editor.destroy();
    if (this.provider) this.provider.destroy();
  },
  methods: {
    setEditorContent(value: string) {
      if (this.editor === null) return;
      this.editor.commands.setContent(value, false, {
        preserveWhitespace: true,
      });
    },
    getRandomColor() {
      const colors = [
        "#958DF1",
        "#F98181",
        "#FBBC88",
        "#FAF594",
        "#70CFF8",
        "#94FADB",
        "#B9F18D",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    },
  },
});
</script>

<style lang="css">
/* give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  word-break: normal;
  pointer-events: none;
}

/* render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0d0d0d;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}

/* make cell selection visible */
.selectedCell {
  @apply relative;
}
.selectedCell:after {
  z-index: 2;
  @apply absolute inset-0 bg-gray-600 bg-opacity-10 pointer-events-none;
  content: "";
}

/* break words within the editor */
.ProseMirror {
  word-break: break-all;
}
</style>
