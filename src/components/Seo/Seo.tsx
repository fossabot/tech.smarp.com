import * as React from "react";
import Helmet from "react-helmet";
import { siteMetadata as config } from "../../../gatsby-config";
import { MarkdownRemark, ImageSharp } from "../../graphql-types";

interface ISeoProp {
  postNode: MarkdownRemark;
  postPath?: string;
  postSEO: boolean;
}

export class Seo extends React.PureComponent<ISeoProp, {}> {
  render() {
    const { postNode, postPath, postSEO } = this.props;
    let title: string;
    let description: string;
    let image: string;
    let postURL: string | null;
    if (postSEO) {
      const postMeta = postNode.frontmatter;
      title = postMeta.title;
      description = postMeta.excerpt
        ? postMeta.excerpt
        : postNode.excerpt;
      image = (postMeta.image.children[0] as ImageSharp).responsiveResolution.src;
      postURL = config.siteUrl + config.pathPrefix + postPath;
    } else {
      title = config.siteTitle;
      description = config.siteDescription;
      image = config.siteLogo;
    }
    const canonical = postNode.frontmatter.canonical;
    const realPrefix = config.pathPrefix === "/" ? "" : config.pathPrefix;
    image = config.siteUrl + realPrefix + image;
    const blogURL = config.siteUrl + config.pathPrefix;
    const schemaOrgJSONLD: any = [
      {
        "@context": "http://schema.org",
        "@type": "WebSite",
        "alternateName": config.siteTitleAlt ? config.siteTitleAlt : "",
        "name": title,
        "url": blogURL,
      },
    ];
    if (postSEO) {
      schemaOrgJSONLD.push([
        {
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "item": {
                "@id": postURL,
                image,
                "name": title,
              },
              "position": 1,
            },
          ],
        },
        {
          "@context": "http://schema.org",
          "@type": "BlogPosting",
          "alternateName": config.siteTitleAlt ? config.siteTitleAlt : "",
          description,
          "headline": title,
          "image": {
            "@type": "ImageObject",
            "url": image,
          },
          "name": title,
          "url": blogURL,
        },
      ]);
    }
    return (
      <Helmet>
        {/* General tags */}
        <meta name="description" content={description} />
        <meta name="image" content={image} />
        { canonical ? <link rel="canonical" href={canonical} /> : null }

        {/* Schema.org tags */}
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgJSONLD)}
        </script>

        {/* OpenGraph tags */}
        <meta property="og:url" content={postSEO ? postURL : blogURL} />
        {postSEO ? <meta property="og:type" content="article" /> : null}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta
          property="fb:app_id"
          content={config.siteFBAppID ? config.siteFBAppID : ""}
        />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:creator"
          content={config.userTwitter ? config.userTwitter : ""}
        />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
    );
  }
}
