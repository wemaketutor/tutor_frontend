import React, { useEffect, useState, useRef } from 'react';
import Loader from './Loader';
import styles from './LoadingWrapper.module.css';

const LoadingWrapper = ({ 
  children, 
  isLoading, 
  shouldLoad = true, 
  onLoad, 
  errorComponent = null,
  errorMessage = 'Произошла ошибка при загрузке данных. Пожалуйста, попробуйте снова.'
}) => {
  const [loading, setLoading] = useState(isLoading !== undefined ? isLoading : shouldLoad);
  const [shouldFadeIn, setShouldFadeIn] = useState(shouldLoad);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  
  // Сбрасываем состояние загрузки при изменении shouldLoad
  useEffect(() => {
    if (!shouldLoad && loading) {
      setLoading(false);
    } else if (shouldLoad && !loading && !hasLoadedRef.current) {
      setLoading(true);
    }
  }, [shouldLoad]);

  useEffect(() => {
    if (isLoading !== undefined) {
      setLoading(isLoading);
    }
  }, [isLoading]);

  useEffect(() => {
    let isMounted = true;
    
    const performLoad = async () => {
      // Если уже загружается, не запускаем повторно
      if (isLoadingRef.current) return;
      
      if (onLoad && loading && shouldLoad && !hasLoadedRef.current) {
        isLoadingRef.current = true;
        
        try {
          // Запоминаем время начала загрузки
          setStartTime(Date.now());
          
          await onLoad();
          
          // Если компонент размонтирован, не обновляем состояние
          if (!isMounted) return;
          
          // Проверяем, прошло ли минимальное время с начала загрузки
          const loadTime = Date.now() - startTime;
          const minLoadTime = 800; // минимум 800 мс для отображения загрузчика
          
          if (loadTime < minLoadTime) {
            // Если загрузка была слишком быстрой, ждем дополнительное время
            await new Promise(resolve => setTimeout(resolve, minLoadTime - loadTime));
          }
          
          // Помечаем, что загрузка выполнена
          hasLoadedRef.current = true;
          
          setTimeout(() => {
            if (isMounted) {
              setLoading(false);
              setShouldFadeIn(false);
            }
          }, 500);
        } catch (error) {
          if (isMounted) {
            setLoading(false);
            setError(error);
            console.error('Loading failed:', error);
          }
        } finally {
          isLoadingRef.current = false;
        }
      }
    };
    
    performLoad();
    
    return () => {
      isMounted = false;
    };
  }, [onLoad, loading, shouldLoad]);

  // Функция для принудительной перезагрузки данных
  const retryLoading = () => {
    hasLoadedRef.current = false;
    setError(null);
    setLoading(true);
  };

  if (loading) {
    return <Loader text="Загрузка..." />;
  }

  if (error) {
    return errorComponent ? (
      errorComponent(error)
    ) : (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{errorMessage}</p>
        <button
          className={styles.retryButton}
          onClick={retryLoading}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${shouldFadeIn ? styles.fadeIn : ''}`}>
      {children}
    </div>
  );
};

export default LoadingWrapper;