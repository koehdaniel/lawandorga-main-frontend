<template>
  <BoxLoader :show="true">
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        v-if="questionnaire"
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Questionnaires', to: { name: 'admin-questionnaires' } },
          {
            name: questionnaire.name,
            to: {
              name: 'admin-questionnaire',
              params: { id: questionnaire.id },
            },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Question', key: 'question' },
          { name: 'Type', key: 'type' },
          { name: 'Order', key: 'order' },
          { name: '', key: 'action' },
        ]"
        :data="fields"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="createFieldModalOpen = true"
            >
              Add Field
            </ButtonNormal>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="
                field = slotProps;
                updateFieldModalOpen = true;
              "
            >
              Change
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                field = slotProps;
                deleteFieldModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
      <TableGenerator
        :head="[
          { name: 'File', key: 'name' },
          { name: '', key: 'action' },
        ]"
        :data="files"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="createFileModalOpen = true"
            >
              Add File
            </ButtonNormal>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="downloadFile(slotProps)"
            >
              Download
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                file = slotProps;
                deleteFileModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
    </div>
    <!-- create field -->
    <ModalFree v-model="createFieldModalOpen" title="Create Field">
      <FormGenerator
        :fields="formFieldFields"
        :request="createFieldRequest"
        :data="{ questionnaire: questionnaire.id }"
      />
    </ModalFree>
    <!-- update field -->
    <ModalFree v-model="updateFieldModalOpen" title="Update Field">
      <FormGenerator
        :fields="formFieldFields"
        :data="field"
        :request="updateFieldRequest"
      />
    </ModalFree>
    <!-- delete field -->
    <ModalDelete
      v-model="deleteFieldModalOpen"
      :request="deleteFieldRequest"
      :data="field"
    />
    <!-- create file -->
    <ModalFree v-model="createFileModalOpen" title="Add File">
      <FormGenerator
        :fields="formFileFields"
        :request="createFileRequest"
        :data="{ questionnaire: questionnaire.id }"
      />
    </ModalFree>
    <!-- delete file -->
    <ModalDelete
      v-model="deleteFileModalOpen"
      :request="deleteFileRequest"
      :data="file"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import {
  QuestionnaireQuestion,
  QuestionnaireTemplateFile,
  QuestionnaireTemplate,
} from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import {
  ModalFree,
  FormGenerator,
  ModalDelete,
  TableGenerator,
  ButtonNormal,
} from "lorga-ui";
import RecordsService from "@/services/records";
import useGet from "@/composables/useGet";
import useDelete from "@/composables/useDelete";
import useCreate from "@/composables/useCreate";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import { useRoute } from "vue-router";
import useCommand from "@/composables/useCommand";

const formFieldFields = [
  {
    label: "Type",
    name: "type",
    type: "select",
    options: [
      { name: "Text", id: "TEXTAREA" },
      { name: "File", id: "FILE" },
    ],
    required: true,
  },
  {
    label: "Question",
    name: "question",
    type: "textarea",
    required: true,
  },
  {
    label: "Order",
    name: "order",
    type: "number",
    required: true,
    helptext: "The ordering in which the fields appear.",
  },
];

const formFileFields = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "File",
    name: "file",
    type: "file",
    required: true,
    helptext:
      "ATTENTION: This file will not be encrypted on the server. It should not contain sensitive information. Uploaded answer pdfs are encrypted.",
  },
];

export default defineComponent({
  components: {
    ModalDelete,
    ModalFree,
    FormGenerator,
    BoxLoader,
    CogIcon,
    BreadcrumbsBar,
    TableGenerator,
    ButtonNormal,
  },
  setup() {
    // other
    const route = useRoute();

    // questionnaire
    const questionnaire = ref(null) as Ref<QuestionnaireTemplate | null>;
    useGet(
      RecordsService.getQuestionnaireTemplate,
      questionnaire,
      route.params.id as string,
    );

    // fields
    const fields = ref(null) as Ref<QuestionnaireQuestion[] | null>;
    const field = ref(null) as Ref<QuestionnaireQuestion | null>;
    const query = useGet(
      RecordsService.getQuestionnaireQuestions,
      fields,
      questionnaire,
    );

    // files
    const files = ref(null) as Ref<QuestionnaireTemplateFile[] | null>;
    const file = ref(null) as Ref<QuestionnaireTemplateFile | null>;
    useGet(RecordsService.getQuestionnaireFiles, files, questionnaire);

    // create file
    const {
      createRequest: createFileRequest,
      createModalOpen: createFileModalOpen,
    } = useCreate(RecordsService.createQuestionnaireFile, files);

    // download file
    const downloadFile = (file: QuestionnaireTemplateFile) =>
      RecordsService.downloadQuestionnaireFile(file);

    // delete file
    const {
      deleteRequest: deleteFileRequest,
      deleteModalOpen: deleteFileModalOpen,
    } = useDelete(RecordsService.deleteQuestionnaireFile, files);

    // create field
    const {
      createRequest: createFieldRequest,
      createModalOpen: createFieldModalOpen,
    } = useCreate(RecordsService.createQuestionnaireQuestion, fields);

    // update field
    const {
      commandRequest: updateFieldRequest,
      commandModalOpen: updateFieldModalOpen,
    } = useCommand(RecordsService.updateQuestionnaireQuestion, query);

    // delete field
    const {
      deleteRequest: deleteFieldRequest,
      deleteModalOpen: deleteFieldModalOpen,
    } = useDelete(RecordsService.deleteQuestionnaireQuestion, fields);

    return {
      questionnaire,
      // field
      field,
      fields,
      formFieldFields,
      // create field
      createFieldRequest,
      createFieldModalOpen,
      // update field
      updateFieldRequest,
      updateFieldModalOpen,
      // delete field
      deleteFieldRequest,
      deleteFieldModalOpen,
      // file
      file,
      files,
      formFileFields,
      // create file
      createFileRequest,
      createFileModalOpen,
      // download file
      downloadFile,
      // delete file
      deleteFileRequest,
      deleteFileModalOpen,
    };
  },
});
</script>
