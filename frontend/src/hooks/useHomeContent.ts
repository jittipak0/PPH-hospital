import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'

export const useNewsQuery = () =>
  useQuery({
    queryKey: queryKeys.news,
    queryFn: api.fetchNews
  })

export const useArticlesQuery = () =>
  useQuery({
    queryKey: queryKeys.articles,
    queryFn: api.fetchArticles
  })

export const useClinicsQuery = () =>
  useQuery({
    queryKey: queryKeys.clinics,
    queryFn: api.fetchClinics
  })
