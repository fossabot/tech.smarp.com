---
title: Continuous Integration (CI) for Golang with Gitlab 8.x
createdDate: '2015-10-09'
updatedDate: '2017-10-06'
author: truongsinh
tags:
  - starter
  - gatsby
image: pexels-photo-253092.jpeg
draft: false
---

With [8.0 release](https://about.gitlab.com/2015/09/22/gitlab-8-0-released/) (by the way, the latest is [8.0.4](https://about.gitlab.com/2015/10/06/gitlab-8-dot-0-dot-4-released/)), GitLab now comes with Continuous Integration (GitLab CI) fully integrated. Smarp has taken this opportunity to reach one step further on the way from start-up MVP toward confident continuous deployment, which I would love to explain in another blog post. In this one, I will share our experience of configuring Gitlab CI (`.gitlab-ci.yml`) to run format/import check, vet, build check, and unit tests with built-in database using Docker service.

First of all, I suggest you read [Gitlab CI Yaml README](http://doc.gitlab.com/ci/yaml/README.html), as it will provide some helpful background knowledge. Gitlab CI has a concept of `stages`, e.g. `build`, `test`, `deploy`. That is, all `jobs` that belong to the same `stage` will be run concurrently ([not necessarily in parallel](http://blog.golang.org/concurrency-is-not-parallelism)). If any of them fails (exit code **NOT** 0), other `jobs` in that `stage`  will still continue to run, but the ones in the following `stages` will not. Only when all jobs (without `allow_fail: true`) in a stage pass (exit code 0), will the jobs in the next `stage` be executed.

At the moment, SmarpShare’s backend (written in Golang) CI manifest has 2 `stages`, `build` and `test`.

## Build stage

In `build`, we validate our PostgreSQL schema using `psql` and `diff` tool. Basically, when we need to change the db (PostgreSQL) schema by adding more columns or tables, we both change the `latest_schema.sql`, and add one more file `[sequential-number].[descriptive-name].sql`, e.g `34.new-user-token.sql`. Then the CI validates the changes by running `latest_schema.sql` from the last (parent) commit, running `34.new-user-token.sql` from the current commit, dumping the schema to `dump_schema.sql`, and running `diff` on it against the `latest_schema.sql` from the current commit  

In the same, `build`, stage we check whether our engineers have remembered to run `[goimports](https://godoc.org/golang.org/x/tools/cmd/goimports)` (a drop-in replacement for your editor’s gofmt-on-save hook), which removes extraneous imported packages, adds required packages that has not been imported, re-arranges the import list alphabetically, and eventually does the same task of `gofmt`; quite neat!  

At the same time, we also `vet` our code  

In fact, thanks to `vet`, we discovered lots of bugs that would otherwise be sitting there and killing us, including such mistakes as incorrect number of `printf` params, dead code, malformed struct tag, etc.  

It’s worth mentioning that SmarpShare has more than one entry points, and that when our engineers refactor code, they only focus on the entry point(s) they are working on, potentially break others. Thus, in the `build` stage, we also try to compile all the entry points in one go. Before CI, there were more than one times a deployment was stopped at last minutes due to silly refactoring.  

You can see that all `jobs` in this `stage` are quite light, they are meant to catch simple errors, such as missed declaration or appending new db (PostgreSQL) schema, forgeting to run `goimports`, using single quotation marks, or simply missing a step or process which would abruptly breaks the compilation.

## Test stage

Now that we are assured that our engineers have not missed anything potentially serious, we can let the CI use more resources to run unit test. In our configuration, we run test with Go1.4, Go1.5 w/ and w/o race detector, because our code is still messing up with data race, unfortunately. We simply declare that we also need service from databases (line 58, 59), checkout submodules, prepare schema, and run the actual test  

## Final words

Here is the whole snippet  

We are now so happy to see the green color whenever we are going to accept a merge request (MR) or are going to deploy a new version of SmarpShare, not only because green is psychologically a nice color, but also because this way we are more confident in what we are doing, and are less likely to be haulted in the last minutes because of something that could have been spotted easily and automatically from the very beginning.
