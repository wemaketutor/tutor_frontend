import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (isLoading !== undefined) {
      setLoading(isLoading);
    }
  }, [isLoading]);

  useEffect(() => {
    const performLoad = async () => {
      if (onLoad && loading && shouldLoad) {
        try {
          await onLoad();
          setTimeout(() => {
            setLoading(false);
            setShouldFadeIn(false);
          }, 500);
        } catch (error) {
          setLoading(false);
          setError(error);
          console.error('Loading failed:', error);
        }
      }
    };
    performLoad();
  }, [onLoad, loading, shouldLoad]);

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
          onClick={() => {
            setError(null);
            setLoading(true);
          }}
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