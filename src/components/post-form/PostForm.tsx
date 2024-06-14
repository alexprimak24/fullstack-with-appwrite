import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Input from "../Input";
import RTE from "../RTE";
import Select from "../Select";
import Button from "../Button";
import appwriteService from "../../appwrite/config";
import { createPostProps, updatePostProps } from "../../appwrite/config"; // Adjust the import path if necessary

interface Post {
  title: string;
  slug: string;
  content: string;
  status: string;
  featuredImage?: string;
  image?: FileList;
}

interface PostFormProps {
  post?: Post;
}

interface AuthState {
  userData: {
    $id: string;
  } | null;
}

interface AuthStateProps {
  auth: AuthState;
}

type PostFormData = (createPostProps | updatePostProps) & { image?: FileList };

export default function PostForm({ post }: PostFormProps) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm<PostFormData>({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state: AuthStateProps) => state.auth.userData);

  const submit = async (data: PostFormData) => {
    if (!userData) {
      console.error("User data is null");
      return;
    }

    if (post) {
      const file = data.image?.[0]
        ? await appwriteService.uploadFile({ file: data.image[0] })
        : null;

      if (file && post.featuredImage) {
        await appwriteService.deleteFile({ fileId: post.featuredImage });
      }

      const dbPost = await appwriteService.updatePost({
        title: data.title,
        slug: data.slug,
        content: data.content,
        featuredImage: file ? file.$id : post.featuredImage, // Handle undefined
        status: data.status,
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      if (data.image && data.image[0]) {
        const file = await appwriteService.uploadFile({ file: data.image[0] });

        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;

          const dbPost = await appwriteService.createPost({
            title: data.title,
            slug: data.slug,
            content: data.content,
            featuredImage: fileId,
            status: data.status,
            userId: userData.$id,
          });

          if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
        }
      }
    }
  };

  const slugTransform = useCallback((value: string) => {
    if (value) {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return value;
  }, []);

  useEffect(() => {
    const subscription = watch((value: Partial<Post>, { name }) => {
      if (name === "title" && value.title) {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg"
          {...register("image")}
        />
        {post?.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview({
                fileId: post.featuredImage,
              })}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
