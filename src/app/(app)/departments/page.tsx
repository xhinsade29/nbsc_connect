
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, FileSignature, Laptop, HeartHandshake, Mail, Phone, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { subscribeToDepartments, Department } from '@/services/departments';

const ICONS: Record<string, LucideIcon> = {
    BookOpen,
    FileSignature,
    Laptop,
    HeartHandshake,
};

const DepartmentIcon = ({ iconName }: { iconName: string }) => {
    const Icon = ICONS[iconName] || BookOpen;
    return <Icon className="h-6 w-6 text-muted-foreground" />;
};


export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
      const unsubscribe = subscribeToDepartments(setDepartments);
      return () => unsubscribe();
  }, []);

  const filteredAndSortedDepartments = useMemo(() => {
    return departments
      .filter((dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === 'name-asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
  }, [searchTerm, sortOrder, departments]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Departments</h1>
        <p className="text-muted-foreground">Contact information for campus departments.</p>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
            <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
        </div>
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sort by:</label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredAndSortedDepartments.map((dept) => (
          <Card key={dept.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-headline text-lg font-medium">{dept.name}</CardTitle>
              <DepartmentIcon iconName={dept.icon} />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground"/>
                        <a href={`mailto:${dept.email}`} className="text-muted-foreground hover:text-primary transition-colors">{dept.email}</a>
                    </div>
                     <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground"/>
                        <span className="text-muted-foreground">{dept.phone}</span>
                    </div>
                </div>
                <Button asChild className="w-full">
                    <Link href={`/departments/${dept.slug}`}>
                        View Department <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
