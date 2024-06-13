import conf from '../conf/conf'
import { Client, Databases, Storage, Query, ID } from "appwrite";

interface getPostProps {
  slug: string;
}

interface createPostProps {
  title: string,
  slug: string,
  content: string,
  featuredImage: string,
  status: string,
  userId:string
}

interface updatePostProps {
  title: string,
  slug: string,
  content: string,
  featuredImage: string,
  status: string,
}

interface uploadFileProps {
  file: File;
}

interface FileIdProps {
  fileId: string;
}

export class Service {
  client:Client = new Client()
  databases:Databases;
  bucket:Storage;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteBucketId)
    
    this.databases = new Databases(this.client)
    this.bucket = new Storage(this.client)
  }

  async getPost({ slug }: getPostProps) {
    try {
      return await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
    } catch (error) {
      console.log("Appwrite service :: getPost() ::", error)
      return false
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId, queries)
    } catch (error) {
      console.log("Appwrite service :: getPosts() ::", error)
      return false
    }
  }

  async createPost({ title, slug, content, featuredImage, status, userId }: createPostProps) {
    try {
      return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug, { title, content, featuredImage, status, userId })
    } catch (error) {
      console.log("Appwrite service :: createPost() ::", error)
      return false
    }
  }

  async updatePost({ title, slug, content, featuredImage, status }: updatePostProps) {
    try {
      return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug, { title, content, featuredImage, status })
    } catch (error) {
      console.log("Appwrite service :: updatePost() ::", error)
      return false
    }
  }

  async deletePost({ slug } : getPostProps) {
    try {
      return await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
    } catch (error) {
      console.log("Appwrite service :: deletePost() ::", error)
      return false
    }
  }

  //storage service

  async uploadFile({ file } : uploadFileProps) {
    try {
      return await this.bucket.createFile(conf.appwriteBucketId, ID.unique(), file)
    } catch (error) {
      console.log("Appwrite service :: uploadFile() ::", error)
      return false
    }
  }

  async deleteFile({ fileId } : FileIdProps) {
    try {
      return await this.bucket.deleteFile(conf.appwriteBucketId, fileId)
    } catch (error) {
      console.log("Appwrite service :: deleteFile() ::", error)
      return false
    }
  }

  getFilePreview({ fileId } : FileIdProps) {
    return this.bucket.getFilePreview(
      conf.appwriteBucketId,
      fileId
    ).href
  }
}

const service = new Service()
export default service;