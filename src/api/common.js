import { get } from '@/utils/request'

export function previewDoc(path) {
  return get('upload/preview_doc', { path })
}
