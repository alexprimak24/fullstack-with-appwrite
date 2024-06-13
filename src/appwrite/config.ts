import conf from '../conf/conf'
import { Client, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client()
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteBucketId)
    
    this.databases = new Databases(this.client)
    this.bucket = new Storage(this.bucket)

    async getPost()
  }
}
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('5df5acd0d48c2'); // Your project ID

const databases = new Databases(client);

