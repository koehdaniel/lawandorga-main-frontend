<template>
  <div>
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'dashboard' }"
      :pages="[]"
    >
      <ChartBarIcon class="w-6 h-6" />
    </BreadcrumbsBar>
  </div>
  <div class="grid grid-cols-12 gap-4 mt-6">
    <!-- general -->
    <StatisticChartWrapper
      title="Most Active Users In The Last 30 Days"
      class="col-span-12"
    >
      <StatisticActiveUsers />
    </StatisticChartWrapper>

    <!-- records -->
    <StatisticChartWrapper
      title="Records Created And Closed"
      class="col-span-12"
    >
      <StatisticRecordsCreatedAndClosed />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Different Record States"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticRecordStates />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Record Tags"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticRecordTags />
    </StatisticChartWrapper>

    <!-- record client -->
    <StatisticChartWrapper
      title="Record Client Sex"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticClientSex />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Record Client Age"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticClientAge />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Record Client Nationality"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticClientNationality />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Record Client State"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticClientState />
    </StatisticChartWrapper>

    <StatisticChartWrapper title="Ideas?" class="col-span-12 xl:col-span-6">
      <p class="prose">
        If you've got any ideas for more statistic or anything you need, feel
        free to email us at
        <a href="mailto:it@law-orga.de">it@law-orga.de</a>
        <span>.</span>
      </p>
    </StatisticChartWrapper>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { ChartBarIcon } from "@heroicons/vue/24/outline";
import StatisticRecordStates from "@/components/StatisticRecordStates.vue";
import StatisticChartWrapper from "@/components/StatisticChartWrapper.vue";
import StatisticRecordTags from "@/components/StatisticRecordTags.vue";
import StatisticClientSex from "@/components/StatisticClientSex.vue";
import StatisticClientAge from "@/components/StatisticClientAge.vue";
import StatisticClientNationality from "@/components/StatisticClientNationality.vue";
import StatisticClientState from "@/components/StatisticClientState.vue";
import StatisticActiveUsers from "@/components/StatisticActiveUsers.vue";
import StatisticRecordsCreatedAndClosed from "@/components/StatisticRecordsCreatedAndClosed.vue";
</script>
