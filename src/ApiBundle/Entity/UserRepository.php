<?php

namespace ApiBundle\Entity;

use Symfony\Component\HttpFoundation\Request;

/**
 * UserRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class UserRepository extends \Doctrine\ORM\EntityRepository
{
    public function fileterByRequest(Request $request)
    {
        $start   = $request->get('start', 0);
        $length    = $request->get('length', 20);

        $order_field    = $request->get('order_field', 'id');
        $order_dir    = $request->get('order_dir', 'DESC');

        $search = $request->get('search', false);

        $qb = $this
            ->createQueryBuilder('user')
            ->select(['user.id', 'user.username', 'user.email', 'user.roles'])
            ->orderBy('user.'.$order_field, $order_dir)
            ->setMaxResults($length)
            ->setFirstResult($start);

        if ($search){
            $qb
                ->andWhere('user.username LIKE :username OR user.email LIKE :email')
                ->setParameter('username', '%'.$search.'%')
                ->setParameter('email', '%'.$search.'%');
        }

        return $qb->getQuery()->getResult();
    }
}
