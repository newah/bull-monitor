import {
  MutationCleanQueueArgs,
  MutationCloseQueueArgs,
  MutationCreateJobArgs,
  MutationDiscardJobArgs,
  MutationEmptyQueueArgs,
  MutationLogArgs,
  MutationMoveJobToCompletedArgs,
  MutationMoveJobToFailedArgs,
  MutationPauseQueueArgs,
  MutationPromoteJobArgs,
  MutationRemoveJobArgs,
  MutationRemoveJobsByPatternArgs,
  MutationResumeQueueArgs,
  MutationRetryJobArgs,
  MutationUpdateJobDataArgs,
} from '../../typings/gql';
import type { TResolvers } from './typings';

export const mutationResolver: TResolvers = {
  Mutation: {
    async createJob(_, args: MutationCreateJobArgs, { dataSources: { bull } }) {
      return await bull.createJob(args.input);
    },
    async pauseQueue(
      _,
      args: MutationPauseQueueArgs,
      { dataSources: { bull } }
    ) {
      return await bull.pauseQueue(args.queue);
    },
    async resumeQueue(
      _,
      args: MutationResumeQueueArgs,
      { dataSources: { bull } }
    ) {
      return await bull.resumeQueue(args);
    },
    async cleanQueue(
      _,
      args: MutationCleanQueueArgs,
      { dataSources: { bull } }
    ) {
      return await bull.cleanQueue(args);
    },
    async emptyQueue(
      _,
      args: MutationEmptyQueueArgs,
      { dataSources: { bull } }
    ) {
      return await bull.emptyQueue(args);
    },
    async closeQueue(
      _,
      args: MutationCloseQueueArgs,
      { dataSources: { bull } }
    ) {
      return await bull.closeQueue(args);
    },
    moveJobToCompleted(
      _,
      args: MutationMoveJobToCompletedArgs,
      { dataSources: { bull } }
    ) {
      return bull.moveJobToCompleted(args);
    },
    moveJobToFailed(
      _,
      args: MutationMoveJobToFailedArgs,
      { dataSources: { bull } }
    ) {
      return bull.moveJobToFailed(args);
    },
    discardJob(_, args: MutationDiscardJobArgs, { dataSources: { bull } }) {
      return bull.discardJob(args);
    },
    promoteJob(_, args: MutationPromoteJobArgs, { dataSources: { bull } }) {
      return bull.promoteJob(args);
    },
    removeJob(_, args: MutationRemoveJobArgs, { dataSources: { bull } }) {
      return bull.removeJobById(args);
    },
    retryJob(_, args: MutationRetryJobArgs, { dataSources: { bull } }) {
      return bull.retryJob(args);
    },
    removeJobsByPattern(
      _,
      args: MutationRemoveJobsByPatternArgs,
      { dataSources: { bull } }
    ) {
      return bull.removeJobsByPattern(args);
    },
    updateJobData(
      _,
      args: MutationUpdateJobDataArgs,
      { dataSources: { bull } }
    ) {
      return bull.updateJobData(args);
    },
    log(_, args: MutationLogArgs, { dataSources: { bull } }) {
      return bull.createJobLog(args);
    },
  },
};