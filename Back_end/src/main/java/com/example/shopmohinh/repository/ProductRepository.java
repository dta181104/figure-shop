package com.example.shopmohinh.repository;

import com.example.shopmohinh.dto.projection.ProductProjection;
import com.example.shopmohinh.dto.search.ProductSearch;
import com.example.shopmohinh.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    @Query(value = """
            select * from product order by product.id desc limit 1
            """,nativeQuery = true)
    Product getTop1();

    @Query(value = """
                    select p.id as 'id',
                           p.code as 'code',
                           p.DESCRIPTION as 'description',
                           p.HEIGHT as 'height',
                           p.NAME as 'name',
                           p.PRICE as 'price',
                           p.QUANTITY as 'quantity',
                           p.WEIGHT as 'weight',
                           p.STATUS as 'status',
                           p.DELETED as 'deleted',
                           i.is_main as 'mainImage',
                           i.image_url as 'imageUrl',
                           i.id as 'idImage'
                           from product p
                           left join image i on p.ID = i.product_id and i.is_main = true
                           where (:#{#request.keyword} is null or p.DESCRIPTION like %:#{#request.keyword}%)
                                 and (:#{#request.minPrice} is null or p.PRICE >= :#{#request.minPrice})
                                 and (:#{#request.maxPrice} is null or p.PRICE <= :#{#request.maxPrice})
                                 and (:#{#request.categoryId} is null or p.category_id = :#{#request.categoryId})
                                 and (:#{#request.deleted} is null or p.DELETED = :#{#request.deleted})
                           order by
                                case when :#{#request.sortBy} = 'HEIGHT' and :#{#request.sortDirection} = 'ASC' then p.HEIGHT end ASC,
                                case when :#{#request.sortBy} = 'HEIGHT' and :#{#request.sortDirection} = 'DESC' then p.HEIGHT end DESC,
                                case when :#{#request.sortBy} = 'NAME' and :#{#request.sortDirection} = 'ASC' then p.NAME end ASC,
                                case when :#{#request.sortBy} = 'NAME' and :#{#request.sortDirection} = 'DESC' then p.NAME end DESC,
                                case when :#{#request.sortBy} = 'UPDATED_DATE' and :#{#request.sortDirection} = 'ASC' then p.UPDATED_DATE end ASC,
                                case when :#{#request.sortBy} = 'UPDATED_DATE' and :#{#request.sortDirection} = 'DESC' then p.UPDATED_DATE end DESC,
                                case when :#{#request.sortBy} = 'PRICE' and :#{#request.sortDirection} = 'ASC' then p.PRICE end ASC,
                                case when :#{#request.sortBy} = 'PRICE' and :#{#request.sortDirection} = 'DESC' then p.PRICE end DESC,
                                case when :#{#request.sortBy} = 'WEIGHT' and :#{#request.sortDirection} = 'ASC' then p.WEIGHT end ASC,
                                case when :#{#request.sortBy} = 'WEIGHT' and :#{#request.sortDirection} = 'DESC' then p.WEIGHT end DESC
                           
            """, nativeQuery = true)
    Page<ProductProjection> getAll(@Param("request") ProductSearch request, Pageable pageable);

    Optional<Product> existsProductById(Long id);

    Optional<Product> findByCode(String code);
}
