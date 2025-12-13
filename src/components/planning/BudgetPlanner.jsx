import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Plus, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from "sonner";

export default function BudgetPlanner({ trip, isOrganizer, onUpdate }) {
  const { language } = useLanguage();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({ name: '', planned: 0, actual: 0, notes: '' });
  const [totalBudget, setTotalBudget] = useState(trip.budget?.total_budget || 0);
  const [showEditBudget, setShowEditBudget] = useState(false);

  const budget = trip.budget || { total_budget: 0, currency: 'ILS', categories: [] };
  const categories = budget.categories || [];

  const totalPlanned = categories.reduce((sum, cat) => sum + (cat.planned || 0), 0);
  const totalActual = categories.reduce((sum, cat) => sum + (cat.actual || 0), 0);
  const remaining = budget.total_budget - totalActual;

  const handleSaveBudget = async () => {
    await base44.entities.Trip.update(trip.id, {
      budget: {
        ...budget,
        total_budget: totalBudget
      }
    });
    setShowEditBudget(false);
    onUpdate();
    toast.success(language === 'he' ? 'התקציב עודכן' : 'Budget updated');
  };

  const handleAddCategory = async () => {
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData
    };

    const updatedCategories = editingCategory
      ? categories.map(c => c.id === editingCategory.id ? newCategory : c)
      : [...categories, newCategory];

    await base44.entities.Trip.update(trip.id, {
      budget: {
        ...budget,
        categories: updatedCategories
      }
    });

    setShowAddCategory(false);
    setEditingCategory(null);
    setCategoryData({ name: '', planned: 0, actual: 0, notes: '' });
    onUpdate();
    toast.success(language === 'he' ? 'הקטגוריה נשמרה' : 'Category saved');
  };

  const handleDeleteCategory = async (categoryId) => {
    const updatedCategories = categories.filter(c => c.id !== categoryId);
    await base44.entities.Trip.update(trip.id, {
      budget: {
        ...budget,
        categories: updatedCategories
      }
    });
    onUpdate();
    toast.success(language === 'he' ? 'הקטגוריה נמחקה' : 'Category deleted');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: budget.currency || 'ILS'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            {language === 'he' ? 'תקציב' : 'Budget'}
          </CardTitle>
          {isOrganizer && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setTotalBudget(budget.total_budget);
                  setShowEditBudget(true);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                {language === 'he' ? 'ערוך תקציב' : 'Edit Budget'}
              </Button>
              <Button
                onClick={() => {
                  setShowAddCategory(true);
                  setEditingCategory(null);
                  setCategoryData({ name: '', planned: 0, actual: 0, notes: '' });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === 'he' ? 'הוסף קטגוריה' : 'Add Category'}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-600 mb-1">{language === 'he' ? 'תקציב כולל' : 'Total Budget'}</p>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(budget.total_budget)}</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <p className="text-sm text-orange-600 mb-1">{language === 'he' ? 'סה"כ בפועל' : 'Total Actual'}</p>
              <p className="text-2xl font-bold text-orange-700">{formatCurrency(totalActual)}</p>
            </CardContent>
          </Card>
          <Card className={`${remaining >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <CardContent className="p-4">
              <p className={`text-sm ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'} mb-1`}>
                {language === 'he' ? 'נותר' : 'Remaining'}
              </p>
              <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {formatCurrency(remaining)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        {budget.total_budget > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {language === 'he' ? 'שימוש בתקציב' : 'Budget Usage'}
              </span>
              <span className="text-sm font-semibold">
                {((totalActual / budget.total_budget) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={(totalActual / budget.total_budget) * 100} className="h-2" />
          </div>
        )}

        {/* Categories */}
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {language === 'he' ? 'אין קטגוריות תקציב עדיין' : 'No budget categories yet'}
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map(category => {
              const diff = category.actual - category.planned;
              const percentage = category.planned > 0 ? (category.actual / category.planned) * 100 : 0;
              
              return (
                <Card key={category.id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{category.name}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">{language === 'he' ? 'מתוכנן' : 'Planned'}</p>
                            <p className="font-semibold">{formatCurrency(category.planned)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">{language === 'he' ? 'בפועל' : 'Actual'}</p>
                            <p className="font-semibold">{formatCurrency(category.actual)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {diff !== 0 && (
                          <Badge variant={diff > 0 ? 'destructive' : 'secondary'} className="gap-1">
                            {diff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {formatCurrency(Math.abs(diff))}
                          </Badge>
                        )}
                        {isOrganizer && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingCategory(category);
                                setCategoryData(category);
                                setShowAddCategory(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    {category.notes && (
                      <p className="text-sm text-gray-600 mt-2">{category.notes}</p>
                    )}
                    {category.planned > 0 && (
                      <Progress value={percentage} className="h-1 mt-2" />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Edit Total Budget Dialog */}
      <Dialog open={showEditBudget} onOpenChange={setShowEditBudget}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'he' ? 'ערוך תקציב כולל' : 'Edit Total Budget'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{language === 'he' ? 'תקציב כולל' : 'Total Budget'}</Label>
              <Input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditBudget(false)}>
              {language === 'he' ? 'ביטול' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveBudget} className="bg-emerald-600 hover:bg-emerald-700">
              {language === 'he' ? 'שמור' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? (language === 'he' ? 'ערוך קטגוריה' : 'Edit Category')
                : (language === 'he' ? 'הוסף קטגוריה' : 'Add Category')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{language === 'he' ? 'שם הקטגוריה' : 'Category Name'}</Label>
              <Input
                value={categoryData.name}
                onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                placeholder={language === 'he' ? 'לדוגמה: אוכל' : 'e.g., Food'}
              />
            </div>
            <div>
              <Label>{language === 'he' ? 'תקציב מתוכנן' : 'Planned Budget'}</Label>
              <Input
                type="number"
                value={categoryData.planned}
                onChange={(e) => setCategoryData({ ...categoryData, planned: parseFloat(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div>
              <Label>{language === 'he' ? 'הוצאה בפועל' : 'Actual Expense'}</Label>
              <Input
                type="number"
                value={categoryData.actual}
                onChange={(e) => setCategoryData({ ...categoryData, actual: parseFloat(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div>
              <Label>{language === 'he' ? 'הערות' : 'Notes'}</Label>
              <Textarea
                value={categoryData.notes}
                onChange={(e) => setCategoryData({ ...categoryData, notes: e.target.value })}
                placeholder={language === 'he' ? 'הערות...' : 'Notes...'}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCategory(false)}>
              {language === 'he' ? 'ביטול' : 'Cancel'}
            </Button>
            <Button onClick={handleAddCategory} className="bg-emerald-600 hover:bg-emerald-700">
              {language === 'he' ? 'שמור' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}