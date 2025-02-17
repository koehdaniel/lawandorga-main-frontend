<template>
  <BoxLoader :show="!!data">
    <div class="max-w-5xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'dashboard' }"
        :pages="[]"
      >
        <Squares2X2Icon class="w-6 h-6" />
      </BreadcrumbsBar>
      <h1 class="text-4xl font-bold text-gray-700">Welcome {{ user?.name }}</h1>
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div class="lg:col-span-2 xl:col-span-3">
          <div class="flex justify-between mt-8">
            <h2
              class="items-baseline text-lg font-medium leading-6 text-gray-700"
            >
              Notes from your LC
            </h2>
            <DashboardCreateNote :query="notesQuery" />
          </div>
          <div
            class="grid grid-cols-1 gap-6 mt-2 lg:grid-cols-2 xl:grid-cols-3"
          >
            <article
              v-for="note in notes"
              :key="note.id"
              class="px-6 pt-4 pb-4 bg-white rounded shadow"
            >
              <h3 class="mb-2 font-medium text-gray-700">
                {{ note.title }}
              </h3>
              <p class="text-sm text-gray-700 break-words whitespace-pre-line">
                {{ note.note }}
              </p>
              <div class="flex justify-end mt-2 space-x-3">
                <DashboardUpdateNote
                  :query="notesQuery"
                  :note-id="note.id"
                  :note-title="note.title"
                  :note-note="note.note"
                />
                <DashboardDeleteNote
                  :query="notesQuery"
                  :note-id="note.id"
                  :note-title="note.title"
                />
              </div>
            </article>
          </div>
        </div>
        <div v-if="data.records">
          <h2 class="mt-8 text-lg font-medium leading-6 text-gray-700">
            Active Records
          </h2>
          <ul class="p-1 mt-2 space-y-1 bg-white rounded shadow">
            <li v-for="record in data.records" :key="record" class="block">
              <router-link
                :to="{
                  name: 'records-detail',
                  params: { record: record.uuid },
                }"
                class="relative block w-full px-4 py-2 text-left text-gray-700 transition rounded-sm group hover:text-gray-900 hover:bg-gray-100"
              >
                {{ record.identifier }}
                ({{ record.state }})
                <div
                  class="absolute top-0 bottom-0 right-0 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="data.changed_records">
          <h2 class="mt-8 text-lg font-medium leading-6 text-gray-700">
            Records updated in the last 10 days
          </h2>
          <ul class="p-1 mt-2 space-y-1 bg-white rounded shadow">
            <li
              v-for="record in data.changed_records"
              :key="record"
              class="block"
            >
              <router-link
                :to="{
                  name: 'records-detail',
                  params: { record: record.uuid },
                }"
                class="relative block w-full px-4 py-2 text-left text-gray-700 transition rounded-sm group hover:text-gray-900 hover:bg-gray-100"
              >
                {{ record.identifier }}
                ({{ formatDate(record.updated) }})
                <div
                  class="absolute top-0 bottom-0 right-0 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="data.members">
          <h2 class="mt-8 text-lg font-medium leading-6 text-gray-700">
            New Members in no groups
          </h2>
          <ul class="p-1 mt-2 space-y-1 bg-white rounded shadow">
            <li v-for="member in data.members" :key="member.id" class="block">
              <router-link
                :to="{
                  name: 'admin-profile',
                  params: { id: member.rlcuserid },
                }"
                class="relative block w-full px-4 py-2 text-left text-gray-700 transition rounded-sm group hover:text-gray-900 hover:bg-gray-100"
              >
                {{ member.name }}
                <div
                  class="absolute top-0 bottom-0 right-0 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="data.questionnaires">
          <h2 class="mt-8 text-lg font-medium leading-6 text-gray-700">
            Questionnaires
          </h2>
          <ul class="p-1 mt-2 space-y-1 bg-white rounded shadow">
            <li
              v-for="questionnaire in data.questionnaires"
              :key="questionnaire.name"
              class="block"
            >
              <router-link
                :to="{
                  name: 'folders-detail',
                  params: { uuid: questionnaire.folder_uuid },
                }"
                class="relative block w-full px-4 py-2 text-left text-gray-700 transition rounded-sm group hover:text-gray-900 hover:bg-gray-100"
              >
                {{ questionnaire.name }}
                <div
                  class="absolute top-0 bottom-0 right-0 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { ref } from "vue";
import UsersService from "@/services/user";
import { Squares2X2Icon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { DashboardInformation, DashboardNote } from "@/types/user";
import { formatDate } from "@/utils/date";
import useGet from "@/composables/useGet";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import useClient from "@/api/client";
import DashboardCreateNote from "@/actions/DashboardCreateNote.vue";
import DashboardDeleteNote from "@/actions/DashboardDeleteNote.vue";
import DashboardUpdateNote from "@/actions/DashboardUpdateNote.vue";

const client = useClient();

const data = ref<DashboardInformation | null>(null);

const request = client.get<DashboardInformation>(
  "api/auth/query/page/dashboard/",
);

useGet(request, data);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const notes = ref<DashboardNote[] | null>(null);

// get
const notesQuery = useGet(UsersService.getNotes, notes);
</script>
