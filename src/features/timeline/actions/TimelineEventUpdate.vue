<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Update
  </ButtonNormal>
  <ModalUpdate
    v-model="commandModalOpen"
    :fields="fields"
    title="Update Timeline Event"
    :request="commandRequest"
    :data="{
      folder_uuid: folderUuid,
      uuid: eventUuid,
      time: eventTime,
      text: eventText,
      title: eventTitle,
    }"
    submit="Update"
  />
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import { toRefs } from "vue";
import useClient from "@/api/client";

const props = defineProps<{
  query: () => void;
  folderUuid: string;
  eventUuid: string;
  eventTime: string;
  eventText: string;
  eventTitle: string;
}>();
const { query, folderUuid } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Title",
    name: "title",
    type: "text",
    required: true,
  },
  {
    label: "Time",
    name: "time",
    type: "datetime-local",
    required: true,
  },
  {
    label: "Text",
    name: "text",
    type: "textarea",
    required: true,
  },
];

const client = useClient();
const request = client.post("api/timeline/timeline/update/");
const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
