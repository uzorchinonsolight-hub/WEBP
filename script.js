// MY SOCIAL MEDIA APP

const postText = document.getElementById("postText");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const posts = document.getElementById("posts");

let selectedImage = "";

// SELECT AN IMAGE

imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select an image.");
        this.value = "";
        return;
    }

    // Limit the image size to 8 MB.
    if (file.size > 8 * 1024 * 1024) {
        alert("Please choose an image smaller than 8 MB.");
        this.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        selectedImage = event.target.result;

        imagePreview.replaceChildren();

        const preview = document.createElement("img");
        preview.src = selectedImage;
        preview.alt = "Selected image preview";

        imagePreview.appendChild(preview);
    };

    reader.readAsDataURL(file);
});


// CREATE A POST

function createPost() {
    const text = postText.value.trim();

    if (!text && !selectedImage) {
        alert("Please write something or select a photo.");
        return;
    }

    const post = document.createElement("article");
    post.className = "post";

    const header = document.createElement("div");
    header.className = "post-header";

    const avatar = document.createElement("img");
    avatar.src = "https://i.pravatar.cc/100?img=12";
    avatar.alt = "Chinonso";
    avatar.onerror = function () {
        this.style.display = "none";
    };

    const userInfo = document.createElement("div");

    const name = document.createElement("strong");
    name.textContent = "Chinonso";

    const time = document.createElement("small");
    time.textContent = "Just now · 🌎";

    userInfo.append(name, time);
    header.append(avatar, userInfo);

    post.appendChild(header);

    if (text) {
        const paragraph = document.createElement("p");
        paragraph.className = "post-text";
        paragraph.textContent = text;
        post.appendChild(paragraph);
    }

    if (selectedImage) {
        const image = document.createElement("img");
        image.className = "post-photo";
        image.src = selectedImage;
        image.alt = "Photo shared by Chinonso";
        post.appendChild(image);
    }

    const stats = document.createElement("div");
    stats.className = "post-stats";

    const likeCount = document.createElement("span");
    likeCount.className = "like-count";
    likeCount.textContent = "👍 0 likes";

    const commentCount = document.createElement("span");
    commentCount.className = "comment-count";
    commentCount.textContent = "0 comments";

    stats.append(likeCount, commentCount);

    const actions = document.createElement("div");
    actions.className = "post-actions";

    const likeButton = document.createElement("button");
    likeButton.className = "like-button";
    likeButton.textContent = "👍 Like";

    const commentButton = document.createElement("button");
    commentButton.className = "comment-button";
    commentButton.textContent = "💬 Comment";

    const shareButton = document.createElement("button");
    shareButton.className = "share-button";
    shareButton.textContent = "↗️ Share";

    actions.append(likeButton, commentButton, shareButton);

    const comments = document.createElement("div");
    comments.className = "comments";

    post.append(header, stats, actions, comments);

    posts.prepend(post);

    postText.value = "";
    imageInput.value = "";
    selectedImage = "";
    imagePreview.replaceChildren();

    post.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// LIKE, COMMENT AND SHARE

posts.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) return;

    const post = button.closest(".post");

    if (!post) return;

    if (button.classList.contains("like-button")) {
        const count = post.querySelector(".like-count");

        let likes = Number(
            count.dataset.likes ??
            count.textContent.match(/\d+/)?.[0] ??
            0
        );

        const liked = button.classList.toggle("liked");

        likes += liked ? 1 : -1;
        likes = Math.max(0, likes);

        count.dataset.likes = likes;
        count.textContent = `👍 ${likes} likes`;

        button.textContent = liked ? "👍 Liked" : "👍 Like";
    }

    if (button.classList.contains("comment-button")) {
        showCommentForm(post);
    }

    if (button.classList.contains("share-button")) {
        sharePost(post);
    }
});


// COMMENT FORM

function showCommentForm(post) {
    const comments = post.querySelector(".comments");

    // Avoid adding duplicate comment forms.
    if (comments.querySelector(".comment-form")) {
        comments.querySelector("input").focus();
        return;
    }

    const form = document.createElement("form");
    form.className = "comment-form";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Write a comment...";
    input.maxLength = 500;
    input.required = true;

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Send";

    form.append(input, submit);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const text = input.value.trim();

        if (!text) return;

        const comment = document.createElement("div");
        comment.className = "comment";

        const name = document.createElement("strong");
        name.textContent = "Chinonso";

        const message = document.createElement("span");
        message.textContent = text;

        comment.append(name, message);

        comments.insertBefore(comment, form);

        const count = post.querySelector(".comment-count");
        const current = Number(
            count.textContent.match(/\d+/)?.[0] ?? 0
        );

        count.textContent = `${current + 1} comments`;

        input.value = "";
    });

    comments.appendChild(form);
    input.focus();
}


// SHARE A POST

async function sharePost(post) {
    const text = post.querySelector(".post-text")?.textContent
        || "Check out this post on MySocial!";

    if (navigator.share) {
        try {
            await navigator.share({
                title: "MySocial",
                text: text,
                url: window.location.href
            });
        } catch (error) {
            if (error.name !== "AbortError") {
                alert("Unable to share this post.");
            }
        }
    } else if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(
                text + "\n" + window.location.href
            );

            alert("Post text and page link copied!");
        } catch {
            alert("Sharing is not available in this browser.");
        }
    } else {
        alert("Sharing is not supported in this browser.");
    }
}


// POST BUTTON

document.getElementById("postButton").addEventListener("click", createPost);

postText.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        createPost();
    }
});


// FEELING BUTTON

document.getElementById("feelingButton").addEventListener("click", function () {
    postText.value += postText.value ? " 😊" : "😊";
    postText.focus();
});


// LIVE VIDEO BUTTON

document.getElementById("liveButton").addEventListener("click", function () {
    alert("Live video requires camera access and a video-streaming backend.");
});


// CREATE STORY

document.getElementById("storyButton").addEventListener("click", function () {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.addEventListener("change", function () {
        const file = this.files[0];

        if (!file || !file.type.startsWith("image/")) return;

        if (file.size > 8 * 1024 * 1024) {
            alert("Please choose an image smaller than 8 MB.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            const story = document.createElement("div");
            story.className = "story";

            const image = document.createElement("img");
            image.src = event.target.result;
            image.alt = "Your new story";

            const label = document.createElement("p");
            label.textContent = "Your story";

            story.append(image, label);

            document.getElementById("stories").appendChild(story);
        };

        reader.readAsDataURL(file);
    });

    input.click();
});


// SEARCH POSTS

document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();

    document.querySelectorAll("#posts .post").forEach(function (post) {
        const text = post.textContent.toLowerCase();

        post.style.display = text.includes(query) ? "" : "none";
    });
});