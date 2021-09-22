import { BullDataSource, MetricsDataSource } from './gql/data-sources';
import { typeDefs } from './gql/type-defs';
import { resolvers } from './gql/resolvers';
import type {
  ApolloServerBase,
  Config as ApolloConfig,
} from 'apollo-server-core';
import { UI } from './ui';
import { DEFAULT_TEXT_SEARCH_SCAN_COUNT } from './gql/data-sources/bull/config';
import type { Config, MetricsConfig } from './typings/config';
import { MetricsCollector } from './metrics-collector';
import { BullMonitorQueue, patchBullQueue } from './queue';

export abstract class BullMonitor<TServer extends ApolloServerBase> {
  constructor(config: Config) {
    this.config = {
      ...this.defaultConfig,
      ...config,
      metrics: config.metrics
        ? { ...this.defaultMetricsConfig, ...config.metrics }
        : false,
    };
    this.ui = new UI();
    this._queues = this.config.queues.map(patchBullQueue);
    if (this.config.metrics) {
      this.initMetricsCollector();
    }
  }
  public abstract init(...args: any): Promise<any>;
  public get queues() {
    return this._queues;
  }
  public set queues(queues: Config['queues']) {
    this._queues = queues.map(patchBullQueue);
    if (this.metricsCollector && this.config.metrics) {
      this.metricsCollector.stopCollecting();
      this.initMetricsCollector();
    }
  }

  protected gqlBasePath = '/graphql';
  protected config: Required<Config>;
  protected server: TServer;
  protected createServer(Server: new (config: ApolloConfig) => TServer) {
    this.server = new Server({
      typeDefs,
      // @ts-ignore
      resolvers,
      playground: this.config.gqlPlayground,
      introspection: this.config.gqlIntrospection,
      dataSources: () => ({
        bull: new BullDataSource(this._queues, {
          textSearchScanCount: this.config.textSearchScanCount,
        }),
        metrics: new MetricsDataSource(this.metricsCollector),
      }),
    });
  }
  protected async startServer() {
    return await this.server.start();
  }
  protected renderUi() {
    return this.ui.render();
  }
  protected get baseUrl() {
    return this.config.baseUrl;
  }
  protected get uiEndpoint() {
    return this.baseUrl || '/';
  }
  protected get gqlEndpoint() {
    const base = this.baseUrl;
    if (!base) {
      return this.gqlBasePath;
    } else if (base.endsWith('/')) {
      return base.slice(0, -1) + this.gqlBasePath;
    }
    return base + this.gqlBasePath;
  }

  private _queues: BullMonitorQueue[];
  private ui: UI;
  private metricsCollector?: MetricsCollector;
  private defaultMetricsConfig: MetricsConfig = {
    redisPrefix: 'bull_monitor::metrics::',
    collectInterval: { hours: 1 },
    maxMetrics: 100,
    blacklist: [],
  };
  private defaultConfig: Required<Config> = {
    queues: [],
    baseUrl: '',
    gqlIntrospection: true,
    gqlPlayground: true,
    textSearchScanCount: DEFAULT_TEXT_SEARCH_SCAN_COUNT,
    metrics: false,
  };
  private initMetricsCollector() {
    this.metricsCollector = new MetricsCollector(
      this._queues,
      this.config.metrics as Required<MetricsConfig>
    );
    this.metricsCollector.startCollecting();
  }
}

export { Config, MetricsConfig };
