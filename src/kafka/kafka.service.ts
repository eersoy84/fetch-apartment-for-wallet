import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Admin, Consumer, Kafka, Producer } from "kafkajs";
import {
  FETCH_APARTMENT_DATA_SERVICE,
  NUM_PARTITIONS,
  REPLICATION_FACTOR,
  APARTMENT_DATA_REQUEST_TOPIC,
} from "src/app.constants";

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private admin: Admin;
  private consumer: Consumer;
  private producer: Producer;
  private logger: Logger;
  private kafka: Kafka;
  constructor(
    @Inject(FETCH_APARTMENT_DATA_SERVICE) private readonly clientKafka: ClientKafka // @Inject(KAFKA) private readonly kafka: Kafka,
  ) {
    this.logger = new Logger(KafkaService.name);
    this.kafka = this.clientKafka.createClient<Kafka>();
  }
  async onModuleDestroy() {
    this.logger.verbose("Kafka service shutting down...");
    await this.admin.disconnect();
    await this.producer.disconnect();
  }

  async onModuleInit() {
    await this.initializeAdmin();
    await this.initializeProducer();
  }
  async initializeAdmin() {
    this.logger.verbose("Admin initializing...");
    this.admin = this.kafka.admin();
    await this.admin.connect();
    const isTopicCreated = await this.createTopics();
    if (!isTopicCreated) {
      this.logger.verbose(`${APARTMENT_DATA_REQUEST_TOPIC} topic already exist with ${NUM_PARTITIONS} partitions...`);
      return;
    }
    this.logger.verbose(`Creating ${APARTMENT_DATA_REQUEST_TOPIC} with ${NUM_PARTITIONS} partitions...`);
  }
  async initializeProducer() {
    this.logger.verbose("Producer initializing...");

    this.producer = this.kafka.producer({
      idempotent: true,
    });

    await this.producer.connect();
  }

  async send(topic: string, dto: any, partition: number) {
    await this.producer.send({
      topic,
      acks: -1,
      messages: [{ value: JSON.stringify(dto), partition }],
    });
  }
  async createTopics(): Promise<boolean> {
    try {
      return await this.admin.createTopics({
        topics: [
          {
            topic: APARTMENT_DATA_REQUEST_TOPIC,
            numPartitions: NUM_PARTITIONS,
            replicationFactor: REPLICATION_FACTOR,
          },
        ],
      });
    } catch (err) {
      this.logger.error("Error creating topic", err);
    }
  }
}
