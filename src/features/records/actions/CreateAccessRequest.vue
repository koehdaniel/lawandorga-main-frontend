<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Request Access
  </ButtonNormal>
  <ModalForm
    v-model="commandModalOpen"
    title="Request Access"
    :fields="[
      {
        label: 'Explanation',
        name: 'explanation',
        type: 'textarea',
        required: false,
      },
    ]"
    :data="{
      record_uuid: recordUuid,
    }"
    :request="commandRequest"
    submit="Request Access"
  />
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { ButtonNormal, ModalForm } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

// props
const props = defineProps<{
  query: () => void;
  recordUuid: string;
}>();
const { query, recordUuid } = toRefs(props);

// request
const client = useClient();
const request = client.post("/api/records/v2/access_requests/");

// create
const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
