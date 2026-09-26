// 构建时从数据里生成成员 id 与谥号候选清单，给服务端校验用
import { getCollection } from 'astro:content';
export async function memberIndex() {
  const ms = await getCollection('members');
  return new Map(ms.map((e) => [e.data.id, { candidates: e.data.posthumous_name?.candidates ?? [], result: e.data.posthumous_name?.result ?? null }]));
}
