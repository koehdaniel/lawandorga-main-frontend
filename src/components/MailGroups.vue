<template>
  <TableGenerator
    :head="[
      { name: 'Group', key: 'group' },
      { name: '', key: 'action' },
    ]"
    :data="groups"
  >
    <template #head-action>
      <MailCreateGroup
        v-if="page && !page.noMailAccount"
        :available-domains="page.available_domains"
        :query="query"
      />
    </template>
    <template #group="item">
      <ButtonLink :to="{ name: 'mail-group', params: { uuid: item.uuid } }">
        {{ item.email }}
      </ButtonLink>
    </template>
    <template #action="item">
      <MailDeleteGroup
        :query="query"
        :group-name="item.email"
        :group-uuid="item.uuid"
      />
    </template>
  </TableGenerator>
</template>

<script setup lang="ts">
import MailCreateGroup from "@/actions/MailCreateGroup.vue";
import MailDeleteGroup from "@/actions/MailDeleteGroup.vue";
import { IMailGroup, MailDashboardPage, NoMailAccount } from "@/types/mail";
import { TableGenerator } from "lorga-ui";
import { computed, PropType, toRefs } from "vue";
import ButtonLink from "./ButtonLink.vue";

// props
const props = defineProps({
  page: {
    required: true,
    type: Object as PropType<MailDashboardPage | NoMailAccount>,
  },
  query: {
    required: true,
    type: Function as PropType<() => void>,
  },
});
const { page } = toRefs(props);

// groups
const groups = computed<IMailGroup[] | null>(() => {
  if (page.value && !page.value.noMailAccount) return page.value.groups;
  return null;
});
</script>
