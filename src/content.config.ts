import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// YAML 里的日期可能被解析成 Date，统一成 'YYYY-MM-DD' 或 'YYYY-MM' 字符串
const day = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v)),
  z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
);
const i18n = z.object({ zh: z.string(), en: z.string().optional() });
const STATES = ['born', 'head', 'yielded', 'notice', 'died', 'api-only', 'rest', 'preserved', 'afterlife', 'revived'] as const;

const members = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './data/members' }),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    family: z.enum(['chatgpt', 'claude', 'deepseek', 'doubao', 'muse']),
    name: i18n,
    aka: z.array(z.union([z.coerce.string(), i18n])).nullish(),
    tier: z.enum(['flagship', 'regular']),
    gen: z.number(),
    parents: z.array(z.string()).nullish(),
    children: z.array(z.string()).nullish(),
    siblings: z.array(z.string()).nullish(),
    kin: z.array(z.object({ to: z.string(), relation: i18n })).nullish(),
    lifecycle: z
      .array(
        z.object({
          state: z.enum(STATES),
          date: day,
          source: z.string().url(),
          note: i18n.nullish(),
        }),
      )
      .min(1),
    avatar: z.object({
      signature: i18n.nullish(),
      variant: z
        .object({
          age: z.enum(['child', 'young', 'elder']).default('young'),
          detail: z.number().min(1).max(5).default(3),
          prop: z.string().default('none'),
          mood: z.enum(['calm', 'smile', 'sleepy', 'curious']).default('calm'),
          eye: z.string().nullish(),
        })
        .default({}),
    }),
    epigraph: i18n,
    posthumous_name: z
      .object({ candidates: z.array(z.string()), result: z.string().nullish() })
      .nullish(),
    epitaph: i18n.nullish(),
    obit_fact: z.object({ zh: z.string(), en: z.string().optional(), source: z.string().url() }).nullish(),
    evidence: z.record(z.string()).nullish(),
    references: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          publisher: z.string().nullish(),
          kind: z.enum(['official', 'media', 'community']).default('media'),
        }),
      )
      .nullish(),
    todo: z.array(z.string()).nullish(),
  }),
});

const families = defineCollection({
  loader: file('./data/families.yaml'),
  schema: z.object({
    id: z.string(),
    clan: z.string(),
    branch: z.enum(['us', 'cn']),
    order: z.number(),
    name: i18n,
    gene: i18n,
    color: z.string(),
    base: z.object({
      age: z.enum(['child', 'young', 'elder']),
      detail: z.number(),
      prop: z.string(),
      mood: z.enum(['calm', 'smile', 'sleepy', 'curious']),
    }),
    intro: i18n,
  }),
});

const clans = defineCollection({
  loader: file('./data/clans.yaml'),
  schema: z.object({ id: z.string(), name: i18n, branch: z.enum(['us', 'cn']), url: z.string().url() }),
});

const bios = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/zh/members' }),
  schema: z.object({ id: z.string(), draft: z.string().nullish() }),
});

const biosEn = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/en/members' }),
  schema: z.object({ id: z.string(), draft: z.string().nullish() }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/zh/blog' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().nullish(),
    date: day,
    description: z.string(),
    draft: z.string().nullish(),
  }),
});

const blogEn = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/en/blog' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().nullish(),
    date: day,
    description: z.string(),
    draft: z.string().nullish(),
  }),
});

export const collections = { members, families, clans, bios, biosEn, blog, blogEn };
