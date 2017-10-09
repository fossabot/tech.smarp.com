# tech.smarp.com

Tech blog of Smarp: Be Nerds – Do Magic – Share Spells

## Preperation

-   Node version 8
-   [git lfs](https://git-lfs.github.com/)
    -   `brew install git-lfs`
-   `npm install`
-   check in `data/author.json` whether you have been listed as an author
    -   check `data/avatars` as well

# Write a blog

-   `npm start`
-   in `data/blog/[your author id]` (e.g. `data/blog/truongsinh`), create new dir (e.g `data/blog/truongsinh/iterations-of-assumption-elimination-and-refinement`)
-   in the newly created dir, create `index.md`
-   write in MarkDown format, with some metadata (see other blog post for example, including inline images)
-   commit and push to `master` or `dev2`

## // @todo

-   Authors' bio
-   page thumbnail
-   <https://help.github.com/articles/installing-git-large-file-storage/>
    -   \*.jpg filter=lfs diff=lfs merge=lfs -text
    -   \*.jpeg filter=lfs diff=lfs merge=lfs -text
